import Router from 'koa-router';
import auth from './auth';
import projects from './projects';
import songs from './songs';
import tracks from './tracks';
import workflows from './workflows';

const router = new Router();

router.use('/auth', auth.routes(), auth.allowedMethods());
router.use('/projects', projects.routes(), projects.allowedMethods());
router.use('/songs', songs.routes(), songs.allowedMethods());
router.use('/tracks', tracks.routes(), tracks.allowedMethods());
router.use('/workflows', workflows.routes(), workflows.allowedMethods());

export default router;
