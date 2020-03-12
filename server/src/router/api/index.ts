import Router from 'koa-router';
import v1 from './v1';

const router = new Router();

router.use('/v1', v1.routes(), v1.allowedMethods());

export default router;
