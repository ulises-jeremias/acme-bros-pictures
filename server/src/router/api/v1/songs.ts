import Router from 'koa-router';
import { songs } from '../../../controller';
import passport from '../../../module/auth';

const router = new Router();

const requireAuth = passport.authenticate('jwt', { failWithError: true });

router
    .get('/', requireAuth, songs.list)
;

export default router;
