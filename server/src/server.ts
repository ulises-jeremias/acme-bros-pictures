const responseTime = require('koa-response-time');
const validator = require('node-input-validator');
const swaggerUi = require('swagger-ui-koa');

import Koa from 'koa';

import compress from 'koa-compress';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import cors from '@koa/cors';

import { router } from './router';
import { getLogLevelForStatus } from './module/logger';
import config from './config';

import overrideValidator from './middleware/validation';
import responseHandler from './middleware/response-handler';
import errorHandler from './middleware/error-handler';
import requestId from './middleware/request-id';
import logging from './middleware/logging';
import options from './middleware/options';

const app: Koa = new Koa();

// centralized error handling
app.on('error', (err: Error, ctx: Koa.DefaultContext): void => {
    console.error(err);
    console.error({req: ctx.request, extra: ctx, level: getLogLevelForStatus(ctx.status)});
});

// Validation middleware -> adds ctx.validate
app.use(validator.koa());
app.use(overrideValidator());

// Provides important security headers to make your app more secure
app.use(helmet());

// Enable cors with default options
app.use(cors(config.cors));

// Enable bodyParser with default options
app.use(bodyParser(config.bodyParser));

// Adds an X-Request-Id response header with a unique request ID value
app.use(requestId());

// Adds an X-Response-Time header with a query execution time value
app.use(responseTime());

// Console debug logging
app.use(logging());

// handler
app.use(responseHandler());
app.use(errorHandler());

app.use(swaggerUi.serve);

app.use(compress());
app.use(options());

// routers
app.use(router.routes()).use(router.allowedMethods());

export default app;
