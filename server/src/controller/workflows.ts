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
     * /workflows:
     *  get:
     *      tags:
     *          - Workflows
     *      summary: Returns workflows for the connected user.
     *      responses:
     *          200:
     *              description: Successful operation
     *              schema:
     *                  $ref: "#/components/schemas/Workflow"
     *          401:
     *              description: Unauthorized
     *              schema:
     *                  $ref: "#/components/responses/Unauthorized"
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

    public static async workflow(ctx: DefaultContext) {
        const { id } = ctx.request.params;

        const user: User = ctx.state.user;
        const workflowRepository = getRepository(Workflow);
        const workflow = await workflowRepository.findOne(id);

        if (!workflow) {
            throw new Forbidden("You cannot access to the asked data");
        }

        const track = await workflow.track;
        const trackProject = await track.project;
        const authProjects = await user.projects;
        const workflowProject = _.find(authProjects, (authProject: Project) => authProject.id === trackProject.id)
        
        if (!workflowProject) {
            throw new Forbidden("You cannot access to the asked data");
        }

        try {
            ctx.ok({ data: workflow });
        } catch (err) {
            throw new InternalError(err);
        }
    }

    public static async updateWorkflow(ctx: DefaultContext) {
        const { id } = ctx.request.params;
        const { title, expectedStartDate, startDate, tasks } = ctx.request.body;
        
        ctx.validate({ title, expectedStartDate, startDate, tasks }, {
            title: ['required'],
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
            throw new Forbidden("You cannot access to the asked data");
        }

        const track = await workflow.track;
        const trackProject = await track.project;
        const authProjects = await user.projects;
        const workflowProject = _.find(authProjects, (authProject: Project) => authProject.id === trackProject.id)
        
        if (!workflowProject) {
            throw new Forbidden("You cannot access to the asked data");
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