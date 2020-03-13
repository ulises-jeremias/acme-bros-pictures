import { BadRequest } from '../global';

export class UserAlreadyExists extends BadRequest {
    constructor(message?: string) {
        super(message || 'User already exists');
    }
}
