import Router from 'koa-router';
import { workflows } from '../../../controller';
import passport from '../../../module/auth';

const router = new Router();

const requireAuth = passport.authenticate('jwt');

router
    .get('/', requireAuth, workflows.list)
    .get('/:id', requireAuth, workflows.workflow)
    .put('/:id', requireAuth, workflows.updateWorkflow)
;

export default router;
