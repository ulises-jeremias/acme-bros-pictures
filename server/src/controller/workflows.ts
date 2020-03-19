const _ = require('underscore');

import { DefaultContext } from 'koa';
import { getRepository, getManager } from 'typeorm';

import { InternalError, Forbidden, BadRequest } from '../constant/errors';
import { Track } from '../entity/Track';
import { User } from '../entity/User';
import { Project } from '../entity/Project';
import { Workflow } from '../entity/Workflow';
import { UserProject } from '../entity/UserProject';

export default class WorkflowsController {

    /**
     * @swagger
     * /workflows:
     *  get:
     *      tags:
     *          - Workflows
     *      summary: Access workflows for the connected user.
     *      security:
     *          - auth: []
     *      responses:
     *          200:
     *              description: Successful operation
     *              schema:
     *                  type: array
     *                  items:
     *                      $ref: "#/components/schemas/Workflow"
     *          401:
     *              $ref: "#/components/responses/Unauthorized"
     *          500:
     *              $ref: "#/components/responses/InternalError"
     */
    public static async list(ctx: DefaultContext) {
        const user: User = ctx.state.user;
        try {
            const userProjectRepository = getRepository(UserProject);
            const trackRepository = getRepository(Track);
            const workflowRepository = getRepository(Workflow);

            const userProjects = await userProjectRepository
                .createQueryBuilder('row')
                .addSelect('row.watching')
                .leftJoinAndSelect('row.project', 'project')
                .where('row.user = :user', { user: user.id })
                .getMany();

            const projects = _.map(userProjects, (userProject: UserProject) => userProject.project);

            const results = _.map(projects, async (project: Project) => {
                return await trackRepository.find({ where: { projectId: project }, relations: ['workflow'] });
            });

            const tracks = await Promise.all(results);
            const workflows = _.map(tracks, async (track: Track) => {
                return await workflowRepository.find({ where: { trackId: track.id }, relations: ['tasks'] });
            });

            ctx.ok({ data: _.flatten(await Promise.all(workflows)) });
        } catch (err) {
            throw new InternalError(err);
        }
    }

    /**
     * @swagger
     * /workflows/{id}:
     *  get:
     *      tags:
     *          - Workflows
     *      summary: Access workflow data.
     *      security:
     *          - auth: []
     *      parameters:
     *          - name: id
     *            in: path
     *            required: true
     *            description: The worflow identifier
     *            type: string
     *      responses:
     *          200:
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
    public static async workflow(ctx: DefaultContext) {
        const { id } = ctx.params;
        const user: User = ctx.state.user;

        const workflowRepository = getRepository(Workflow);
        const userProjectRepository = getRepository(UserProject);

        const workflow = await workflowRepository.findOne({ where: { id }, relations: ['tasks'] });

        if (!workflow) {
            throw new Forbidden('You cannot access to the asked data');
        }

        const trackRepository = getRepository(Track);
        const track = await trackRepository.findOne({
            where: { workflowId: id },
            relations: ['project'],
        });
        const trackProject = await track.project;

        const userProject = await userProjectRepository
            .createQueryBuilder('row')
            .addSelect('row.watching')
            .leftJoinAndSelect('row.project', 'project')
            .where('row.user = :user', { user: user.id })
            .andWhere('row.project = :project', { project: trackProject.id })
            .getOne();

        if (!userProject) {
            throw new Forbidden('You cannot access to the asked data');
        }

        try {
            ctx.ok({ data: workflow });
        } catch (err) {
            throw new InternalError(err);
        }
    }

    /**
     * @swagger
     * /workflows:
     *  post:
     *      tags:
     *          - Workflows
     *      summary: Create the workflow for the given track.
     *      security:
     *          - auth: []
     *      parameters:
     *          - name: track
     *            in: body
     *            required: true
     *            description: The track identifier
     *            type: string
     *          - name: description
     *            in: body
     *            description: The worflow description
     *            type: string
     *            required: true
     *          - name: expectedStartDate
     *            in: body
     *            description: The worflow expected start date
     *            type: string
     *            required: true
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
    public static async createWorkflow(ctx: DefaultContext) {
        const { trackId, description, expectedStartDate} = ctx.request.body;

        await ctx.validate({ trackId, description, expectedStartDate}, {
            trackId: ['required'],
            description: ['required'],
            expectedStartDate: ['required'],
        });

        const user: User = ctx.state.user;

        const trackRepository = getRepository(Track);
        const userProjectRepository = getRepository(UserProject);

        const track = await trackRepository.findOne(trackId);

        if (!track) {
            throw new Forbidden('You cannot access to the asked data');
        }

        const trackProject = await track.project;

        const userProject = await userProjectRepository
            .createQueryBuilder('row')
            .addSelect('row.watching')
            .leftJoinAndSelect('row.project', 'project')
            .where('row.user = :user', { user: user.id })
            .andWhere('row.project = :project', { project: trackProject.id })
            .getOne();

        if (!userProject) {
            throw new Forbidden('You cannot access to the asked data');
        }

        try {
            await getManager().transaction(async transactionalEntityManager => {
                const workflow = transactionalEntityManager.create(Workflow, { description, expectedStartDate });
                workflow.track = Promise.resolve(track);
                const createdWorkflow = await transactionalEntityManager.save(workflow);
                track.workflow = transactionalEntityManager.findOne(Workflow, createdWorkflow.id);
                await transactionalEntityManager.save(Track, track);
                ctx.created({ data: createdWorkflow });
            });
        } catch (err) {
            if (err.name === 'QueryFailedError') {
                throw new BadRequest('There was a problem creating the workflow');
            } else {
                throw new InternalError(err);
            }
        }
    }

    /**
     * @swagger
     * /workflows/{id}:
     *  put:
     *      tags:
     *          - Workflows
     *      summary: Update the workflow.
     *      security:
     *          - auth: []
     *      parameters:
     *          - name: id
     *            in: path
     *            required: true
     *            description: The worflow identifier
     *            type: string
     *          - name: description
     *            in: body
     *            description: The worflow description
     *            type: string
     *          - name: expectedStartDate
     *            in: body
     *            description: The worflow expected start date
     *            type: string
     *      responses:
     *          200:
     *              description: Successful operation
     *              schema:
     *                  $ref: "#/components/schemas/Workflow"
     *          400:
     *              $ref: "#/components/responses/BadRequest"
     *          401:
     *              $ref: "#/components/responses/Unauthorized"
     *          403:
     *              $ref: "#/components/responses/Forbidden"
     *          500:
     *              $ref: "#/components/responses/InternalError"
     */
    public static async updateWorkflow(ctx: DefaultContext) {
        const { id } = ctx.params;
        const { description, expectedStartDate} = ctx.request.body;

        await ctx.validate({ description, expectedStartDate}, {
            description: [],
            expectedStartDate: [],
        });

        const user: User = ctx.state.user;
        const workflowRepository = getRepository(Workflow);
        const workflow = await workflowRepository.findOne(id);

        if (!workflow) {
            throw new Forbidden('You cannot access to the asked data');
        }

        const track = await workflow.track;
        const trackProject = await track.project;
        const userProjectRepository = getRepository(UserProject);

        const userProject = await userProjectRepository
            .createQueryBuilder('row')
            .addSelect('row.watching')
            .leftJoinAndSelect('row.project', 'project')
            .where('row.user = :user', { user: user.id })
            .andWhere('row.project = :project', { project: trackProject.id })
            .getOne();

        if (!userProject) {
            throw new Forbidden('You cannot access to the asked data');
        }

        try {
            await workflowRepository.update(workflow, { description, expectedStartDate});
            const updatedWorkflow = await workflowRepository.findOne(id);
            ctx.ok({ data: updatedWorkflow });
        } catch (err) {
            throw new InternalError(err);
        }
    }
}