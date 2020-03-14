import { DefaultContext } from 'koa';
import { User } from '../entity/User';
import { InternalError } from '../constant/errors';
import { getRepository } from 'typeorm';
import { Track } from '../entity/Track';

export default class TracksController {

    /**
     * @swagger
     * /tracks/:id/workflow:
     *  get:
     *      tags:
     *          - Tracks
     *      summary: Access projects for the connected user.
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
    public static async trackWorkflow(ctx: DefaultContext) {
        const { id } = ctx.params;

        const trackRepository = getRepository(Track);
        const track = await trackRepository.findOne(id);

        try {
            const workflow = await track.workflow;
            ctx.ok({ data: workflow });
        } catch (err) {
            throw new InternalError(err);
        }
    }
}