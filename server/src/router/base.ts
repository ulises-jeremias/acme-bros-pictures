const swaggerUi = require('swagger-ui-koa');

import Router from 'koa-router';

import swaggerSpec from '../module/swagger';
import { general } from '../controller';
import { DefaultContext } from 'koa';

const router = new Router();

router
    .get('/', general.index)
    .get('swagger', swaggerUi.setup(swaggerSpec))
    .get('swagger.json', (ctx: DefaultContext) => {
        ctx.body = swaggerSpec;
    })
;

export default router;