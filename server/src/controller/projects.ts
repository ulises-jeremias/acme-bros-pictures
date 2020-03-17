const _ = require('underscore');

import { getRepository, In } from 'typeorm';
import { DefaultContext } from 'koa';
import { InternalError, Forbidden, BadRequest } from '../constant/errors';
import { User } from '../entity/User';
import { Project } from '../entity/Project';

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
     *                  type: array
     *                  items:
     *                      $ref: "#/components/schemas/Project"
     *          401:
     *              $ref: "#/components/responses/Unauthorized"
     *          500:
     *              $ref: "#/components/responses/InternalError"
     */
    public static async list(ctx: DefaultContext) {
        const user: User = ctx.state.user;


        try {
            const projects = await user.projects;
            ctx.ok({ data: projects });
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
     *                  $ref: "#/components/schemas/Project"
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

        const authProjects = await user.projects;
        const project: Project = _.find(authProjects, (authProject: Project) => authProject.id === id);

        if (!project) {
            throw new Forbidden('You cannot access to the asked data');
        }

        (await project.employees).map((user: User) => delete user.password);
        await project.tracks;

        ctx.ok({ data: project });
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
     *                  $ref: "#/components/schemas/Project"
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
        });

        const projectRepository = getRepository(Project);
        const userRepository = getRepository(User);

        try {
            const existingEmployees: User[] = await userRepository
                .find({
                    where: { id: In(employees.map((data: { id: string }) => data.id)) }
                });

            const project = projectRepository.create({ name });
            project.employees = Promise.resolve(existingEmployees);
            const createdProject: Project = await projectRepository.save(project);
            (await createdProject.employees).map((user: User) => delete user.password);
            ctx.created({ data: createdProject });
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

        const authProjects = await user.projects;
        const project = _.find(authProjects, (authProject: Project) => authProject.id === id);

        if (!project) {
            throw new Forbidden('You cannot access to the asked data');
        }

        try {
            const tracks = await project.tracks;
            ctx.ok({ data: tracks });
        } catch (err) {
            throw new InternalError(err);
        }
    }
}