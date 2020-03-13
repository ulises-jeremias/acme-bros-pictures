import { NotFound } from '../global';

export class UserNotFound extends NotFound {
    constructor() {
        super();
        this.message = `${this.message} User not found`;
    }
}
