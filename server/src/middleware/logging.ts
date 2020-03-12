import { getLogLevelForStatus } from '../module/logger';
import config from '../config';
import * as winston from 'winston';
import { DefaultContext } from 'koa';

export default () => async (ctx: DefaultContext, next: () => Promise<any>) => {
    const start = new Date().getMilliseconds();

    await next();

    const ms = new Date().getMilliseconds() - start;
    const msg: string = `${ctx.method} ${ctx.originalUrl} ${ctx.status} ${ms}ms`;

    winston.configure({
        level: 'debug',
        transports: [
            //
            // - Write to all logs with specified level to console.
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                )
            })
        ]
    });

    if (!config.isProduction) {
        winston.log(getLogLevelForStatus(ctx.status, 'winston'), msg);
    }
};