const swaggerUi = require('swagger-ui-koa');

import Router from 'koa-router';

import swaggerSpec from '../module/swagger';
import { general } from '../controller';

const router = new Router();

router
    .get('/', general.index)
    .get('swagger', swaggerUi.setup(swaggerSpec))
;

export default router;