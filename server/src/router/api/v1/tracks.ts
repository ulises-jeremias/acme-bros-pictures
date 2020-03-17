import Router from 'koa-router';
import { tracks } from '../../../controller';
import passport from '../../../module/auth';

const router = new Router();

const requireAuth = passport.authenticate('jwt', { failWithError: true });

router
    .get('/', requireAuth, tracks.list)
    .get('/:id', requireAuth, tracks.track)
    .get('/:id/workflow', requireAuth, tracks.trackWorkflow)
    .post('/:id/workflow', requireAuth, tracks.createTrackWorkflow)
;

export default router;
