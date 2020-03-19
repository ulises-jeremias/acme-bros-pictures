import Router from 'koa-router';
import { tasks } from '../../../controller';
import passport from '../../../module/auth';

const router = new Router();

const requireAuth = passport.authenticate('jwt', { failWithError: true });

router
    .get('/', requireAuth, tasks.list)
    .post('/', requireAuth, tasks.createTask)
    .get('/:id', requireAuth, tasks.task)
    .put('/:id', requireAuth, tasks.updateTask)
;

export default router;
