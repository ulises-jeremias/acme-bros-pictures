import Router from 'koa-router';
import auth from './auth';
import projects from './projects';
import tracks from './tracks';

const router = new Router();

router.use('/auth', auth.routes(), auth.allowedMethods());
router.use('/projects', projects.routes(), projects.allowedMethods());
router.use('/tracks', tracks.routes(), tracks.allowedMethods());

export default router;
