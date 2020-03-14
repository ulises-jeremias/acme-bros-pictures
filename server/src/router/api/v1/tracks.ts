import Router from 'koa-router';
import { tracks } from '../../../controller';
import passport from '../../../module/auth';

const router = new Router();

const requireAuth = passport.authenticate('jwt');

router
    .get('/:id/workflow', requireAuth, tracks.trackWorkflow)
;

export default router;
