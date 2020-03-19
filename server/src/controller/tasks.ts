const _ = require('underscore');

import { DefaultContext } from 'koa';
import { getRepository } from 'typeorm';

import { InternalError, Forbidden, BadRequest } from '../constant/errors';
import { Track } from '../entity/Track';
import { User } from '../entity/User';
import { Project } from '../entity/Project';
import { Workflow } from '../entity/Workflow';
import { UserProject } from '../entity/UserProject';
import { Task, taskStatusValues } from '../entity/Task';

export default class WorkflowsController {

    /**
     * @swagger
     * /tasks:
     *  get:
     *      tags:
     *          - Tasks
     *      summary: Access tasks for the connected user.
     *      security:
     *          - auth: []
     *      responses:
     *          200:
     *              description: Successful operation
     *              schema:
     *                  type: object
     *                  properties:
     *                      status:
     *                          type: string
     *                          example: success
     *                      data:
     *                          type: array
     *                          items:
     *                              $ref: "#/components/schemas/Task"
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
            const taskRepository = getRepository(Task);

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
                return await workflowRepository.find({ where: { workflowId: track.id }, relations: ['tasks'] });
            });

            const workflowsTasks = _.map(await Promise.all(workflows), async (workflow: Workflow) => {
                return await taskRepository.find({ where: { workflowId: workflow.id }, relations: ['workflow'] });
            });

            ctx.ok({ data: _.flatten(await Promise.all(workflowsTasks)) });
        } catch (err) {
            throw new InternalError(err);
        }
    }

    /**
     * @swagger
     * /tasks/{id}:
     *  get:
     *      tags:
     *          - Tasks
     *      summary: Access task data.
     *      security:
     *          - auth: []
     *      parameters:
     *          - name: id
     *            in: path
     *            required: true
     *            description: The task identifier
     *            type: string
     *      responses:
     *          200:
     *              description: Successful operation
     *              schema:
     *                  type: object
     *                  properties:
     *                      status:
     *                          type: string
     *                          example: success
     *                      data:
     *                          type: object
     *                          $ref: "#/components/schemas/Task"
     *          401:
     *              $ref: "#/components/responses/Unauthorized"
     *          403:
     *              $ref: "#/components/responses/Forbidden"
     *          500:
     *              $ref: "#/components/responses/InternalError"
     */
    public static async task(ctx: DefaultContext) {
        const { id } = ctx.params;
        const user: User = ctx.state.user;

        const workflowRepository = getRepository(Workflow);
        const userProjectRepository = getRepository(UserProject);
        const taskRepository = getRepository(Task);
        const trackRepository = getRepository(Track);

        const task = await taskRepository.findOne({ where: { id }, relations: ['workflow'] });

        if (!task) {
            throw new Forbidden('You cannot access to the asked data');
        }

        const workflow = await workflowRepository.findOne({
            where: { workflowId: task.workflowId },
            relations: ['track'],
        });

        const track = await trackRepository.findOne({
            where: { workflowId: workflow.id },
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
            ctx.ok({ data: task });
        } catch (err) {
            throw new InternalError(err);
        }
    }

    /**
     * @swagger
     * /tasks:
     *  post:
     *      tags:
     *          - Tasks
     *      summary: Create the task for the given track.
     *      security:
     *          - auth: []
     *      parameters:
     *          - name: workflowId
     *            in: body
     *            required: true
     *            description: The workflow identifier
     *            type: string
     *          - name: description
     *            in: body
     *            description: The task description
     *            type: string
     *            required: true
     *          - name: status
     *            in: body
     *            description: The task status
     *            required: true
     *            type: string
     *            enum:
     *                - todo
     *                - running
     *                - success
     *                - failed
     *      responses:
     *          201:
     *              description: Successful operation
     *              schema:
     *                  type: object
     *                  properties:
     *                      status:
     *                          type: string
     *                          example: success
     *                      data:
     *                          type: object
     *                          $ref: "#/components/schemas/Task"
     *          401:
     *              $ref: "#/components/responses/Unauthorized"
     *          403:
     *              $ref: "#/components/responses/Forbidden"
     *          500:
     *              $ref: "#/components/responses/InternalError"
     */
    public static async createTask(ctx: DefaultContext) {
        const user: User = ctx.state.user;
        const { workflowId, description, status } = ctx.request.body;

        await ctx.validate({ workflowId, description, status }, {
            workflowId: ['required'],
            description: ['required'],
            status: ['required', `in:${taskStatusValues.join(',')}`],
        });


        const taskRepository = getRepository(Task);
        const trackRepository = getRepository(Track);
        const workflowRepository = getRepository(Workflow);
        const userProjectRepository = getRepository(UserProject);

        const workflow = await workflowRepository.findOne({ where: { id: workflowId }, relations: ['track'] });

        if (!workflow) {
            throw new Forbidden('You cannot access to the asked data');
        }

        const track = await trackRepository.findOne({ where: { workflowId: workflow.id }, relations: ['project'] });
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
            const task = taskRepository.create({ description, status });
            task.workflow = Promise.resolve(workflow);
            const createdTask = await taskRepository.save(task);
            ctx.created({ data: createdTask });
        } catch (err) {
            if (err.name === 'QueryFailedError') {
                throw new BadRequest('There was a problem creating the task');
            } else {
                throw new InternalError(err);
            }
        }
    }

    /**
     * @swagger
     * /tasks/{id}:
     *  put:
     *      tags:
     *          - Tasks
     *      summary: Update the task.
     *      security:
     *          - auth: []
     *      parameters:
     *          - name: id
     *            in: path
     *            required: true
     *            description: The task identifier
     *            type: string
     *          - name: description
     *            in: body
     *            description: The task description
     *            type: string
     *          - name: status
     *            in: body
     *            description: The task status
     *            type: string
     *            enum:
     *                - todo
     *                - running
     *                - success
     *                - failed
     *      responses:
     *          200:
     *              description: Successful operation
     *              schema:
     *                  type: object
     *                  properties:
     *                      status:
     *                          type: string
     *                          example: success
     *                      data:
     *                          type: object
     *                          $ref: "#/components/schemas/Task"
     *          400:
     *              $ref: "#/components/responses/BadRequest"
     *          401:
     *              $ref: "#/components/responses/Unauthorized"
     *          403:
     *              $ref: "#/components/responses/Forbidden"
     *          500:
     *              $ref: "#/components/responses/InternalError"
     */
    public static async updateTask(ctx: DefaultContext) {
        const user: User = ctx.state.user;
        const { id } = ctx.params;
        const { description, status } = ctx.request.body;

        await ctx.validate({ description, status }, {
            description: [],
            status: [`in:${taskStatusValues.join(',')}`],
        });

        const taskRepository = getRepository(Task);
        const trackRepository = getRepository(Track);
        const workflowRepository = getRepository(Workflow);
        const userProjectRepository = getRepository(UserProject);

        const task = await taskRepository.findOne({ where: { id }, relations: ['workflow'] });

        const workflow = await workflowRepository.findOne({ where: { id: task.workflowId }, relations: ['track'] });

        if (!workflow) {
            throw new Forbidden('You cannot access to the asked data');
        }

        const track = await trackRepository.findOne({ where: { workflowId: workflow.id }, relations: ['project'] });
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
            await taskRepository.update(task, { description, status });
            const updatedTask = await taskRepository.findOne(id);
            ctx.ok({ data: updatedTask });
        } catch (err) {
            throw new InternalError(err);
        }
    }
}