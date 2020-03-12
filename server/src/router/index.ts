import Router from 'koa-router';
import base from './base';

const router = new Router();

router.use('/', base.routes(), base.allowedMethods());

export {
    router,
};
