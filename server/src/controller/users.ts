const _ = require('underscore');

import { DefaultContext } from 'koa';
import { InternalError } from '../constant/errors';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';

export default class UsersController {

    /**
     * @swagger
     * /users:
     *  get:
     *      tags:
     *          - Users
     *      summary: Access available users.
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
     *                              $ref: "#/components/schemas/User"
     *          401:
     *              $ref: "#/components/responses/Unauthorized"
     *          500:
     *              $ref: "#/components/responses/InternalError"
     */
    public static async list(ctx: DefaultContext) {
        try {
            const songRepository = getRepository(User);
            const users = await songRepository.find();
            ctx.ok({ data: users });
        } catch (err) {
            throw new InternalError(err);
        }
    }
}