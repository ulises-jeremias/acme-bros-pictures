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
     *      responses:
     *          200:
     *              description: Successful operation
     *              schema:
     *                  $ref: "#/components/schemas/Project"
     *          401:
     *              description: Unauthorized
     *              schema:
     *                  $ref: "#/components/responses/Unauthorized"
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
     * /projects/:id/tracks:
     *  get:
     *      tags:
     *          - Projects
     *      summary: Access project data.
     *      responses:
     *          200:
     *              description: Successful operation
     *              schema:
     *                  $ref: "#/components/schemas/Project"
     *          401:
     *              description: Unauthorized
     *              schema:
     *                  $ref: "#/components/responses/Unauthorized"
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
     * /projects/:id/tracks:
     *  get:
     *      tags:
     *          - Projects
     *      summary: Access tracks for the given project.
     *      responses:
     *          200:
     *              description: Successful operation
     *              schema:
     *                  $ref: "#/components/schemas/Track"
     *          401:
     *              description: Unauthorized
     *              schema:
     *                  $ref: "#/components/responses/Unauthorized"
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