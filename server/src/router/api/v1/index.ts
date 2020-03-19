import Router from 'koa-router';
import auth from './auth';
import projects from './projects';
import songs from './songs';
import tasks from './tasks';
import tracks from './tracks';
import users from './users';
import workflows from './workflows';

import { general } from '../../../controller';

const router = new Router();

router.use('/auth', auth.routes(), auth.allowedMethods());
router.use('/projects', projects.routes(), projects.allowedMethods());
router.use('/songs', songs.routes(), songs.allowedMethods());
router.use('/tasks', tasks.routes(), tasks.allowedMethods());
router.use('/tracks', tracks.routes(), tracks.allowedMethods());
router.use('/users', users.routes(), users.allowedMethods());
router.use('/workflows', workflows.routes(), workflows.allowedMethods());

router
    .get('/', general.index)
;

export default router;
