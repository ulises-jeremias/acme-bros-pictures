import { BaseError } from './base-error';
import { constants } from 'http2';

export class Forbidden extends BaseError {
    constructor(error: string) {
        super();
        this.statusCode = constants.HTTP_STATUS_FORBIDDEN;
        this.code = 'FORBIDDEN';
        this.message = error;
    }
}
