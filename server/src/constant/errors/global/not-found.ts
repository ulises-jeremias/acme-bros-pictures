import { BaseError } from './base-error';
import { constants } from 'http2';

export class NotFound extends BaseError {
    constructor(message?: string) {
        super();
        this.statusCode = constants.HTTP_STATUS_NOT_FOUND;
        this.code = 'UNKNOWN_ENDPOINT';
        this.message = message || 'The requested endpoint does not exist.';
    }
}
