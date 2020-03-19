const _ = require('underscore');

import { DefaultContext } from 'koa';
import { getRepository } from 'typeorm';

import { InternalError, Forbidden } from '../constant/errors';
import { Track } from '../entity/Track';
import { User } from '../entity/User';
import { Project } from '../entity/Project';
import { UserProject } from '../entity/UserProject';
import { Song } from '../entity/Song';

function mixedTimeToTime(value: string): string|any {
    const [hours, minutes, seconds] = value.split(':');
    const date = new Date();
    if (hours)
        date.setHours(parseInt(hours));
    if (minutes)
        date.setMinutes(parseInt(minutes));
    if (seconds)
        date.setSeconds(parseInt(seconds));
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

export default class TracksController {

    /**
     * @swagger
     * /tracks:
     *  get:
     *      tags:
     *          - Tracks
     *      summary: Access tracks for the connected user.
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
     *                              $ref: "#/components/schemas/Track"
     *          401:
     *              $ref: "#/components/responses/Unauthorized"
     *          500:
     *              $ref: "#/components/responses/InternalError"
     */
    public static async list(ctx: DefaultContext) {
        const user: User = ctx.state.user;
        try {
            const userProjectRepository = getRepository(UserProject);
            const trackRepository = getRepository(Track);

            const userProjects = await userProjectRepository
                .createQueryBuilder('row')
                .addSelect('row.watching')
                .leftJoinAndSelect('row.project', 'project')
                .where('row.user = :user', { user: user.id })
                .getMany();

            const projects = _.map(userProjects, (userProject: UserProject) => userProject.project);

            const results = _.map(projects, async (project: Project) => {
                return await trackRepository.find({ where: { projectId: project } });
            });

            ctx.ok({ data: await Promise.all(results) });
        } catch (err) {
            throw new InternalError(err);
        }
    }

    /**
     * @swagger
     * /tracks/{id}:
     *  get:
     *      tags:
     *          - Tracks
     *      summary: Access track data.
     *      security:
     *          - auth: []
     *      parameters:
     *          - name: id
     *            in: path
     *            required: true
     *            description: The track identifier
     *            type: string
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
     *                          type: object
     *                          $ref: "#/components/schemas/Track"
     *          401:
     *              $ref: "#/components/responses/Unauthorized"
     *          403:
     *              $ref: "#/components/responses/Forbidden"
     *          500:
     *              $ref: "#/components/responses/InternalError"
     */
    public static async track(ctx: DefaultContext) {
        const { id } = ctx.params;
        const user: User = ctx.state.user;

        const trackRepository = getRepository(Track);

        const track = await trackRepository.findOne(id);
        const trackProject = await track.project;
        const userProjectRepository = getRepository(UserProject);

        const userProject = await userProjectRepository
            .createQueryBuilder('row')
            .addSelect('row.watching')
            .leftJoinAndSelect('row.project', 'project')
            .where('row.user = :user', { user: user.id })
            .andWhere('row.project = :project', { project: trackProject.id })
            .getOne();

        if (!userProject) {
            throw new Forbidden('You cannot access to the asked data');
        }

        ctx.ok({ data: track });
    }

    /**
     * @swagger
     * /tracks:
     *  post:
     *      tags:
     *          - Tracks
     *      summary: Create the track for the given data.
     *      security:
     *          - auth: []
     *      parameters:
     *          - name: projectId
     *            in: body
     *            required: true
     *            description: The track identifier
     *            type: string
     *          - name: startTime
     *            in: body
     *            type: string
     *            required: true
     *          - name: endTime
     *            in: body
     *            type: string
     *            required: true
     *          - name: songStartTime
     *            in: body
     *            type: string
     *            required: true
     *          - name: songEndTime
     *            in: body
     *            type: string
     *            required: true
     *          - name: song
     *            in: body
     *            description: The song
     *            type: object
     *            schema:
     *                  $ref: "#/components/schemas/Song"
     *      responses:
     *          201:
     *              description: Successful operation
     *              schema:
     *                  type: object
     *                  properties:
     *                      status:
     *                          type: string
     *                          example: success
     *                      data:
     *                          type: object
     *                          $ref: "#/components/schemas/Track"
     *          401:
     *              $ref: "#/components/responses/Unauthorized"
     *          403:
     *              $ref: "#/components/responses/Forbidden"
     *          500:
     *              $ref: "#/components/responses/InternalError"
     */
    public static async createTrack(ctx: DefaultContext) {
        const user: User = ctx.state.user;
        const { projectId, song: songData, startTime, endTime, songStartTime, songEndTime } = ctx.request.body;

        await ctx.validate({ projectId, song: songData, startTime, endTime, songStartTime, songEndTime }, {
            projectId: ['required'],
            song: ['required'],
            startTime: ['required'],
            endTime: ['required'],
            songStartTime: ['required'],
            songEndTime: ['required'],
        });

        const userProjectRepository = getRepository(UserProject);

        const userProject = await userProjectRepository
            .createQueryBuilder('row')
            .addSelect('row.watching')
            .leftJoinAndSelect('row.project', 'project')
            .where('row.user = :user', { user: user.id })
            .andWhere('row.project = :project', { project: projectId })
            .getOne();

        if (!userProject) {
            throw new Forbidden('You cannot access to the asked data');
        }

        const songRepository = getRepository(Song);
        const trackRepository = getRepository(Track);

        let song: Song = null;

        if (songData.id) {
            song = await songRepository.findOne(songData.id);
        }
        if (!song) {
            const { title, author } = songData;
            song = songRepository.create({ title, author });
            song = await songRepository.save(song);
        }

        try {
            const track = trackRepository.create({
                startTime: mixedTimeToTime(startTime),
                endTime: mixedTimeToTime(endTime),
                songStartTime: mixedTimeToTime(songEndTime),
                songEndTime: mixedTimeToTime(songEndTime)
            });
            track.project = Promise.resolve(userProject.project);
            track.song = Promise.resolve(song);
            const createdTrack = await trackRepository.save(track);
            ctx.created({ data: createdTrack });
        } catch (err) {
            throw new InternalError(err);
        }
    }

    /**
     * @swagger
     * /tracks/{id}/workflow:
     *  get:
     *      tags:
     *          - Tracks
     *      summary: Access workflow for the given track.
     *      security:
     *          - auth: []
     *      parameters:
     *          - name: id
     *            in: path
     *            required: true
     *            description: The track identifier
     *            type: string
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
     *                              $ref: "#/components/schemas/Workflow"
     *          401:
     *              $ref: "#/components/responses/Unauthorized"
     *          403:
     *              $ref: "#/components/responses/Forbidden"
     *          500:
     *              $ref: "#/components/responses/InternalError"
     */
    public static async trackWorkflow(ctx: DefaultContext) {
        const { id } = ctx.params;
        const user: User = ctx.state.user;

        const trackRepository = getRepository(Track);

        const track = await trackRepository.findOne(id);
        const trackProject = await track.project;
        const userProjectRepository = getRepository(UserProject);

        const userProject = await userProjectRepository
            .createQueryBuilder('row')
            .addSelect('row.watching')
            .leftJoinAndSelect('row.project', 'project')
            .where('row.user = :user', { user: user.id })
            .andWhere('row.project = :project', { project: trackProject.id })
            .getOne();

        if (!userProject) {
            throw new Forbidden('You cannot access to the asked data');
        }

        try {
            const workflow = await track.workflow;
            ctx.ok({ data: workflow });
        } catch (err) {
            throw new InternalError(err);
        }
    }
}