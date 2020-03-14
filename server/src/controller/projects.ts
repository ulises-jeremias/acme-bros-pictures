import { DefaultContext } from 'koa';
import { User } from '../entity/User';
import { InternalError } from '../constant/errors';

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
}