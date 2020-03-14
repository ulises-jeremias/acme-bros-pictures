import Router from 'koa-router';
import { projects } from '../../../controller';
import passport from '../../../module/auth';

const router = new Router();

const requireAuth = passport.authenticate('jwt');

router
    .get('/', requireAuth, projects.list)
;

export default router;
