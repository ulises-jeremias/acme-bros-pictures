const _ = require('underscore');

import { DefaultContext } from 'koa';
import { User } from '../entity/User';
import { InternalError, Forbidden } from '../constant/errors';
import { Song } from '../entity/Song';
import { getRepository } from 'typeorm';

export default class SongsController {

    /**
     * @swagger
     * /songs:
     *  get:
     *      tags:
     *          - Songs
     *      summary: Access songs for the connected user.
     *      responses:
     *          200:
     *              description: Successful operation
     *              schema:
     *                  $ref: "#/components/schemas/Song"
     *          401:
     *              description: Unauthorized
     *              schema:
     *                  $ref: "#/components/responses/Unauthorized"
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