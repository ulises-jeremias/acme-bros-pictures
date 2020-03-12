import Router from 'koa-router';
import base from './base';
import api from './api'

const router = new Router();

router.use('/', base.routes(), base.allowedMethods());
router.use('/api', api.routes(), api.allowedMethods());

export {
    router,
};
