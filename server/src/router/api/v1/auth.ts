const passport = require('koa-passport');

import Router from 'koa-router';
import { auth } from '../../../controller';

const router = new Router();

const requireAuth = passport.authenticate('jwt');
const requireLogin = passport.authenticate('local');

router
    .get('/login', requireLogin, auth.login)
;

export default router;
