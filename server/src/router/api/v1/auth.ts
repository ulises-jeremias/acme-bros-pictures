import Router from 'koa-router';
import { auth } from '../../../controller';
import passport from '../../../module/auth';

const router = new Router();

const requireAuth = passport.authenticate('jwt', { failWithError: true });
const requireLogin = passport.authenticate('local', { failWithError: true });

router
    .get('/me', requireAuth, auth.me)
    .post('/login', requireLogin, auth.login)
    .post('/', auth.register)
;

export default router;
