const _ = require('underscore');

import { DefaultContext } from 'koa';
import { getRepository } from 'typeorm';

import { InternalError, Forbidden } from '../constant/errors';
import { Track } from '../entity/Track';
import { User } from '../entity/User';
import { Project } from '../entity/Project';
import { Workflow } from '../entity/Workflow';
import { taskStatusValues } from '../entity/Task';

export default class WorkflowsController {

    /**
     * @swagger
     * /worflows:
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
            const projects = await user.projects;
            const workflows: Workflow[] = [];

            _.forEach(projects, async (project: Project) => {
                const tracks = await project.tracks;

                _.forEach(tracks, async (track: Track) => {
                    const trackWorkflow = await track.workflow;
                    workflows.concat(trackWorkflow);
                });
            });

            ctx.ok({ data: workflows });
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
        const { id } = ctx.request.params;

        const user: User = ctx.state.user;
        const workflowRepository = getRepository(Workflow);
        const workflow = await workflowRepository.findOne(id);

        if (!workflow) {
            throw new Forbidden('You cannot access to the asked data');
        }

        const track = await workflow.track;
        const trackProject = await track.project;
        const authProjects = await user.projects;
        const workflowProject = _.find(authProjects, (authProject: Project) => authProject.id === trackProject.id);

        if (!workflowProject) {
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
     * /worflows/{id}:
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
     *          - name: title
     *            in: body
     *            description: The worflow description
     *            type: string
     *          - name: expectedStartDate
     *            in: body
     *            description: The worflow expected start date
     *            type: string
     *          - name: startDate
     *            in: body
     *            description: The worflow start date
     *            type: string
     *          - name: tasks
     *            in: body
     *            description: The tasks
     *            type: array
     *            items:
     *                  $ref: "#/components/schemas/Task"
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
        const { id } = ctx.request.params;
        const { title, expectedStartDate, startDate, tasks } = ctx.request.body;

        ctx.validate({ title, expectedStartDate, startDate, tasks }, {
            title: [],
            expectedStartDate: ['date'],
            startDate: ['date'],
            tasks: ['array'],
            'tasks.*.status': [`in:${taskStatusValues.join(',')}`],
            'tasks.*.startDate': ['date'],
            'tasks.*.endDate': ['date'],
        });

        const user: User = ctx.state.user;
        const workflowRepository = getRepository(Workflow);
        const workflow = await workflowRepository.findOne(id);

        if (!workflow) {
            throw new Forbidden('You cannot access to the asked data');
        }

        const track = await workflow.track;
        const trackProject = await track.project;
        const authProjects = await user.projects;
        const workflowProject = _.find(authProjects, (authProject: Project) => authProject.id === trackProject.id);

        if (!workflowProject) {
            throw new Forbidden('You cannot access to the asked data');
        }

        try {
            await workflowRepository.update(workflow, { title, expectedStartDate, startDate, tasks });
            const updatedWorkflow = await workflowRepository.findOne(id);
            ctx.ok({ data: updatedWorkflow });
        } catch (err) {
            throw new InternalError(err);
        }
    }
}