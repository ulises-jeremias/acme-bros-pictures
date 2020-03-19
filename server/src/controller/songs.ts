const _ = require('underscore');

import { DefaultContext } from 'koa';
import { InternalError } from '../constant/errors';
import { Song } from '../entity/Song';
import { getRepository } from 'typeorm';

export default class SongsController {

    /**
     * @swagger
     * /songs:
     *  get:
     *      tags:
     *          - Songs
     *      summary: Access available songs.
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
     *                              $ref: "#/components/schemas/Song"
     *          401:
     *              $ref: "#/components/responses/Unauthorized"
     *          500:
     *              $ref: "#/components/responses/InternalError"
     */
    public static async list(ctx: DefaultContext) {
        try {
            const songRepository = getRepository(Song);
            const songs = await songRepository.find();
            ctx.ok({ data: songs });
        } catch (err) {
            throw new InternalError(err);
        }
    }
}