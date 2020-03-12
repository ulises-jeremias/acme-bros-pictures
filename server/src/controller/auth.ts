import { DefaultContext } from 'koa';

export default class AuthController {

    /**
     * @swagger
     * /:
     *  get:
     *      tags:
     *          - Auth
     *      summary: The welcome string is returned.
     *      responses:
     *          200:
     *              description: welcome message
     *              content:
     *                  application/plain:
     *                      schema:
     *                          type: string
     *                      example:
     *                          Welcome to ACME BROS Pictures API
     */
    public static async login(ctx: DefaultContext) {
        ctx.body = 'Welcome to ACME BROS Pictures API';
    }
}