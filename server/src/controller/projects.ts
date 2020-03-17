const _ = require('underscore');

import { DefaultContext } from 'koa';
import { User } from '../entity/User';
import { InternalError, Forbidden } from '../constant/errors';
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
        const { id } = ctx.request.params;
        const user: User = ctx.state.user;

        const authProjects = await user.projects;
        const project = _.find(authProjects, (authProject: Project) => authProject.id === id);

        if (!project) {
            throw new Forbidden('You cannot access to the asked data');
        }

        ctx.ok({ data: project });
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
        const { id } = ctx.request.params;
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