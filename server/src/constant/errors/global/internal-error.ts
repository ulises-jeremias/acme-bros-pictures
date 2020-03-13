import { BaseError } from './base-error';
import { constants } from 'http2';

export class InternalError extends BaseError {
    constructor(message?: string) {
        super();
        this.statusCode = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
        this.code = 'INTERNAL_ERROR';
        this.message = message || 'The server encountered an internal error.';
    }
}
