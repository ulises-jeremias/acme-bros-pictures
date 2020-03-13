import Router from 'koa-router';
import { auth } from '../../../controller';
import passport from '../../../module/auth';

const router = new Router();

const requireAuth = passport.authenticate('jwt');
const requireLogin = passport.authenticate('local');

router
    .get('/me', requireAuth, auth.me)
    .post('/login', requireLogin, auth.login)
    .post('/', auth.register)
;

export default router;
