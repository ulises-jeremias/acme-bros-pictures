const jwt = require('jsonwebtoken');

import { DefaultContext } from 'koa';
import { getRepository, Equal } from 'typeorm';

import { User } from '../entity/User';
import config from '../config';
import { UserAlreadyExists, InternalError } from '../constant/errors';

function generateToken(user: { username: string }) {
    return jwt.sign({ user: user.username }, config.session.secret, {
      expiresIn: config.session.expiresIn, // in seconds
    });
}

export default class AuthController {

    /**
     * @swagger
     * /auth/login:
     *  post:
     *      tags:
     *          - Auth
     *      summary: Logs user into the system.
     *      parameters:
     *          - name: username
     *            in: body
     *            description: The user name for login
     *            required: true
     *            type: string
     *          - name: password
     *            in: body
     *            description: The password for login in clear text
     *            required: true
     *            type: string
     *      responses:
     *          200:
     *              description: Successful operation
     *              schema:
     *                  type: string
     *          400:
     *              description: Invalid username/password supplied
     *
     */
    public static async login(ctx: DefaultContext) {
        const token = generateToken(ctx.state.user);
        ctx.ok({ data: `JWT ${token}` });
    }

    /**
     * @swagger
     * /auth/me:
     *  get:
     *      tags:
     *          - Auth
     *      summary: Access profile info.
     *      responses:
     *          200:
     *              description: Successful operation
     *              schema:
     *                  $ref: "#/components/schemas/User"
     *          401:
     *              description: Unauthorized
     *              schema:
     *                  $ref: "#/components/responses/Unauthorized"
     */
    public static async me(ctx: DefaultContext) {
        ctx.ok({ data: ctx.state.user });
    }

    /**
     * @swagger
     * /auth:
     *  post:
     *      tags:
     *          - Auth
     *      summary: Register user into the system.
     *      parameters:
     *          - name: username
     *            in: body
     *            description: The user name of the user
     *            required: true
     *            type: string
     *          - name: name
     *            in: body
     *            description: The name of the user
     *            required: false
     *            type: string
     *          - name: email
     *            in: body
     *            description: The email of the user in clear text
     *            required: true
     *            type: string
     *          - name: password
     *            in: body
     *            description: The password of the user in clear text
     *            required: true
     *            type: string
     *      responses:
     *          201:
     *              description: Successful operation
     *              schema:
     *                  $ref: "#/components/schemas/User"
     *          400:
     *              description: Invalid username/password supplied
     *
     */
    public static async register(ctx: DefaultContext) {
        const { username, email, password, name } = ctx.request.body;

        await ctx.validate({ username, email, password, name }, {
            email: ['required', 'email'],
            username: ['required'],
            password: ['required'],
        });

        const userRepository = getRepository(User);

        const dupUsername = await userRepository.findOne({ username });
        const dupEmail = await userRepository.findOne({ email });

        if (dupUsername || dupEmail) {
            throw new UserAlreadyExists();
        }

        const newUser = userRepository.create({ username, email, password, name: name || '' });

        try {
            const createdUser: User = await userRepository.save(newUser);
            delete createdUser.password;
            return ctx.created({ data: createdUser });
        } catch (err) {
            if (err.name === 'QueryFailedError') {
                throw new UserAlreadyExists('User with this credentials already exists');
            } else {
                throw new InternalError(err);
            }
        }
    }
}