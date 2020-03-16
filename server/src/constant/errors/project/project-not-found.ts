import { NotFound } from '../global';

export class ProjectNotFound extends NotFound {
    constructor() {
        super();
        this.message = `${this.message} Track not found`;
    }
}
