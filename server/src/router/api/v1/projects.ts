import Router from 'koa-router';
import { projects } from '../../../controller';
import passport from '../../../module/auth';

const router = new Router();

const requireAuth = passport.authenticate('jwt');

router
    .get('/', requireAuth, projects.list)
    .get('/:id', requireAuth, projects.project)
    .get('/:id/tracks', requireAuth, projects.projectTracks)
;

export default router;
