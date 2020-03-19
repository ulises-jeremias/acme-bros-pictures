const _ = require('underscore');

import { getRepository, In, getManager } from 'typeorm';
import { DefaultContext } from 'koa';
import { InternalError, Forbidden, BadRequest } from '../constant/errors';
import { User } from '../entity/User';
import { Project } from '../entity/Project';
import { UserProject } from '../entity/UserProject';
import { Track } from '../entity/Track';
import { Workflow } from '../entity/Workflow';
import { Task } from '../entity/Task';

export default class ProjectsController {

    /**
     * @swagger
     * /projects:
     *  get:
     *      tags:
     *          - Projects
     *      summary: Access projects for the connected user.
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
     *                              $ref: "#/components/schemas/Project"
     *          401:
     *              $ref: "#/components/responses/Unauthorized"
     *          500:
     *              $ref: "#/components/responses/InternalError"
     */
    public static async list(ctx: DefaultContext) {
        const user: User = ctx.state.user;
        const userProjectRepository = getRepository(UserProject);

        try {
            const projects = await userProjectRepository.find({ user });
            const results = _.map(projects, async (project: UserProject) => ({
                watching: project.watching,
                project: project.project,
                employeesCount: await userProjectRepository.count({ project: project.project }),
            }));

            ctx.ok({ data: await Promise.all(results) });
        } catch (err) {
            throw new InternalError(err);
        }
    }

    /**
     * @swagger
     * /projects/{id}:
     *  get:
     *      tags:
     *          - Projects
     *      summary: Access project data.
     *      security:
     *          - auth: []
     *      parameters:
     *          - name: id
     *            in: path
     *            required: true
     *            description: The project identifier
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
     *                          $ref: "#/components/schemas/Project"
     *          401:
     *              $ref: "#/components/responses/Unauthorized"
     *          403:
     *              $ref: "#/components/responses/Forbidden"
     *          500:
     *              $ref: "#/components/responses/InternalError"
     */
    public static async project(ctx: DefaultContext) {
        const { id } = ctx.params;
        const user: User = ctx.state.user;

        const userProjectRepository = getRepository(UserProject);
        const taskRepository = getRepository(Task);
        const trackRepository = getRepository(Track);
        const projectRepository = getRepository(Project);
        const workflowRepository = getRepository(Workflow);

        const userProject = await userProjectRepository
            .createQueryBuilder('row')
            .addSelect('row.watching')
            .leftJoinAndSelect('row.project', 'project')
            .where('row.user = :user', { user: user.id })
            .andWhere('row.project = :project', { project: id })
            .getOne();

        if (!userProject) {
            throw new Forbidden('You cannot access to the asked data');
        }

        const { watching } = userProject;
        const project = await projectRepository.findOne({
            where: { id: userProject.project.id },
            relations: ['projectEmployees', 'tracks'],
        });

        const tracks = await trackRepository.find({
            where: { project },
            relations: ['song', 'workflow']
        });

        const results = _.map(tracks, async (track: Track) => {
            const workflow = await workflowRepository.findOne({
                where: { track },
                relations: ['tasks'],
            });
            return {
                ...track,
                workflow: {
                    ...workflow,
                    tasks: await taskRepository.find({
                        where: { workflowId: track.workflowId },
                    })
                }
            };
        });

        const projectTracks = await Promise.all(results);

        ctx.ok({ data: { watching, project: { ...project, projectTracks } } });
    }

    /**
     * @swagger
     * /projects:
     *  post:
     *      tags:
     *          - Projects
     *      summary: Create the project.
     *      security:
     *          - auth: []
     *      parameters:
     *          - name: name
     *            in: body
     *            description: The project name
     *            type: string
     *            required: true
     *          - name: employees
     *            in: body
     *            description: The employees
     *            required: true
     *            type: array
     *            items:
     *                  $ref: "#/components/schemas/User"
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
     *                          $ref: "#/components/schemas/Project"
     *          401:
     *              $ref: "#/components/responses/Unauthorized"
     *          403:
     *              $ref: "#/components/responses/Forbidden"
     *          500:
     *              $ref: "#/components/responses/InternalError"
     */
    public static async createProject(ctx: DefaultContext) {
        const { name, employees } = ctx.request.body;

        await ctx.validate({ name, employees }, {
            name: ['required'],
            employees: ['required', 'array', 'minLength:1'],
            'employees.*.id': ['required'],
        });

        const userRepository = getRepository(User);

        const existingEmployees: User[] = await userRepository
            .find({
                where: { id: In(_.map(employees, (data: { id: string }) => data.id)) }
            });

        try {
            await getManager().transaction(async transactionalEntityManager => {
                const project = transactionalEntityManager.create(Project, { name });
                const createdProject = await transactionalEntityManager.save(project);
                const projectEmployees = _.map(existingEmployees, (emp: User) => (
                    transactionalEntityManager.create(UserProject, { user: emp, project })
                ));
                const createdProjectEmployees = await transactionalEntityManager.save(projectEmployees);
                createdProject.projectEmployees = Promise.resolve(createdProjectEmployees);
                await transactionalEntityManager.save(createdProject);
                await createdProject.projectEmployees;
                ctx.created({ data: createdProject });
            });
        } catch (err) {
            if (err.name === 'QueryFailedError') {
                throw new BadRequest('There was a problem creating the project');
            } else {
                throw new InternalError(err);
            }
        }
    }

    /**
     * @swagger
     * /projects/{id}/tracks:
     *  get:
     *      tags:
     *          - Projects
     *      summary: Access tracks for the given project.
     *      security:
     *          - auth: []
     *      parameters:
     *          - name: id
     *            in: path
     *            required: true
     *            description: The project identifier
     *            type: string
     *      responses:
     *          200:
     *              description: Successful operation
     *              schema:
     *                  type: array
     *                  items:
     *                      $ref: "#/components/schemas/Track"
     *          401:
     *              $ref: "#/components/responses/Unauthorized"
     *          403:
     *              $ref: "#/components/responses/Forbidden"
     *          500:
     *              $ref: "#/components/responses/InternalError"
     */
    public static async projectTracks(ctx: DefaultContext) {
        const { id } = ctx.params;
        const user: User = ctx.state.user;

        const userProjectRepository = getRepository(UserProject);
        const projectRepository = getRepository(Project);

        const userProject = await userProjectRepository
            .createQueryBuilder('row')
            .addSelect('row.watching')
            .leftJoinAndSelect('row.project', 'project')
            .where('row.user = :user', { user: user.id })
            .andWhere('row.project = :project', { project: id })
            .getOne();

        if (!userProject) {
            throw new Forbidden('You cannot access to the asked data');
        }

        const project = await projectRepository.findOne({
            where: { id: userProject.project.id },
            relations: ['tracks'],
        });

        try {
            const tracks = await project.tracks;
            ctx.ok({ data: tracks || [] });
        } catch (err) {
            throw new InternalError(err);
        }
    }
}