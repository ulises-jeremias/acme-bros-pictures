import { NotFound } from '../global';

export class TrackNotFound extends NotFound {
    constructor() {
        super();
        this.message = `${this.message} Track not found`;
    }
}
