import Router from 'koa-router';
import { projects } from '../../../controller';
import passport from '../../../module/auth';

const router = new Router();

const requireAuth = passport.authenticate('jwt', { failWithError: true });

router
    .get('/', requireAuth, projects.list)
    .post('/', requireAuth, projects.createProject)
    .get('/:id', requireAuth, projects.project)
    .get('/:id/tracks', requireAuth, projects.projectTracks)
;

export default router;
