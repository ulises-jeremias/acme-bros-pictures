const _ = require('underscore');

import { DefaultContext } from 'koa';
import { getRepository, getManager } from 'typeorm';

import { InternalError, Forbidden, BadRequest } from '../constant/errors';
import { Track } from '../entity/Track';
import { User } from '../entity/User';
import { Project } from '../entity/Project';
import { Workflow } from '../entity/Workflow';
import { taskStatusValues } from '../entity/Task';

export default class TracksController {

    /**
     * @swagger
     * /tracks:
     *  get:
     *      tags:
     *          - Tracks
     *      summary: Access tracks for the connected user.
     *      security:
     *          - auth: []
     *      responses:
     *          200:
     *              description: Successful operation
     *              schema:
     *                  type: array
     *                  items:
     *                      $ref: "#/components/schemas/Track"
     *          401:
     *              $ref: "#/components/responses/Unauthorized"
     *          500:
     *              $ref: "#/components/responses/InternalError"
     */
    public static async list(ctx: DefaultContext) {
        const user: User = ctx.state.user;
        try {
            const projects = await user.projects;
            const tracks: Track[] = [];

            _.forEach(projects, async (project: Project) => {
                const projectTracks = await project.tracks;
                tracks.concat(projectTracks);
            });

            ctx.ok({ data: tracks });
        } catch (err) {
            throw new InternalError(err);
        }
    }

    /**
     * @swagger
     * /tracks/{id}:
     *  get:
     *      tags:
     *          - Tracks
     *      summary: Access track data.
     *      security:
     *          - auth: []
     *      parameters:
     *          - name: id
     *            in: path
     *            required: true
     *            description: The track identifier
     *            type: string
     *      responses:
     *          200:
     *              description: Successful operation
     *              schema:
     *                  $ref: "#/components/schemas/Track"
     *          401:
     *              $ref: "#/components/responses/Unauthorized"
     *          403:
     *              $ref: "#/components/responses/Forbidden"
     *          500:
     *              $ref: "#/components/responses/InternalError"
     */
    public static async track(ctx: DefaultContext) {
        const { id } = ctx.params;
        const user: User = ctx.state.user;

        const trackRepository = getRepository(Track);

        const track = await trackRepository.findOne(id);
        const trackProject = await track.project;
        const authProjects = await user.projects;
        const project = _.find(authProjects, (authProject: Project) => authProject.id === trackProject.id);

        if (!project) {
            throw new Forbidden('You cannot access to the asked data');
        }

        ctx.ok({ data: track });
    }

    /**
     * @swagger
     * /tracks/{id}/workflow:
     *  get:
     *      tags:
     *          - Tracks
     *      summary: Access workflow for the given track.
     *      security:
     *          - auth: []
     *      parameters:
     *          - name: id
     *            in: path
     *            required: true
     *            description: The track identifier
     *            type: string
     *      responses:
     *          200:
     *              description: Successful operation
     *              schema:
     *                  type: array
     *                  items:
     *                      $ref: "#/components/schemas/Workflow"
     *          401:
     *              $ref: "#/components/responses/Unauthorized"
     *          403:
     *              $ref: "#/components/responses/Forbidden"
     *          500:
     *              $ref: "#/components/responses/InternalError"
     */
    public static async trackWorkflow(ctx: DefaultContext) {
        const { id } = ctx.params;
        const user: User = ctx.state.user;

        const trackRepository = getRepository(Track);

        const track = await trackRepository.findOne(id);
        const trackProject = await track.project;
        const authProjects = await user.projects;
        const project = _.find(authProjects, (authProject: Project) => authProject.id === trackProject.id);

        if (!project) {
            throw new Forbidden('You cannot access to the asked data');
        }

        try {
            const workflow = await track.workflow;
            ctx.ok({ data: workflow });
        } catch (err) {
            throw new InternalError(err);
        }
    }

    /**
     * @swagger
     * /tracks/{id}/workflow:
     *  post:
     *      tags:
     *          - Tracks
     *      summary: Create the workflow for the given track.
     *      security:
     *          - auth: []
     *      parameters:
     *          - name: id
     *            in: path
     *            required: true
     *            description: The track identifier
     *            type: string
     *          - name: title
     *            in: body
     *            description: The worflow description
     *            type: string
     *            required: true
     *          - name: expectedStartDate
     *            in: body
     *            description: The worflow expected start date
     *            type: string
     *            required: true
     *          - name: tasks
     *            in: body
     *            description: The tasks
     *            type: array
     *            items:
     *                  $ref: "#/components/schemas/Task"
     *      responses:
     *          201:
     *              description: Successful operation
     *              schema:
     *                  $ref: "#/components/schemas/Workflow"
     *          401:
     *              $ref: "#/components/responses/Unauthorized"
     *          403:
     *              $ref: "#/components/responses/Forbidden"
     *          500:
     *              $ref: "#/components/responses/InternalError"
     */
    public static async createTrackWorkflow(ctx: DefaultContext) {
        const { id } = ctx.params;
        const { title, expectedStartDate, tasks } = ctx.request.body;

        await ctx.validate({ title, expectedStartDate, tasks }, {
            title: ['required'],
            expectedStartDate: ['required', 'date'],
            tasks: ['array'],
            'tasks.*.status': [`in:${taskStatusValues.join(',')}`],
            'tasks.*.startDate': ['date'],
            'tasks.*.endDate': ['date'],
        });

        const user: User = ctx.state.user;

        const trackRepository = getRepository(Track);
        const workflowRepository = getRepository(Workflow);

        const track = await trackRepository.findOne(id);
        const trackProject = await track.project;
        const authProjects = await user.projects;
        const project = _.find(authProjects, (authProject: Project) => authProject.id === trackProject.id);

        if (!project) {
            throw new Forbidden('You cannot access to the asked data');
        }

        try {
            const workflow = workflowRepository.create({ title, expectedStartDate, tasks });
            track.workflow = Promise.resolve(workflow);
            await trackRepository.save(track);
            ctx.created({ data: workflow });
        } catch (err) {
            if (err.name === 'QueryFailedError') {
                throw new BadRequest('There was a problem creating the workflow');
            } else {
                throw new InternalError(err);
            }
        }
    }
}