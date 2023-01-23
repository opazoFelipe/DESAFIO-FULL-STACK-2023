import { CustomError } from './custom-error';

export class ForbiddenError extends CustomError {
    statusCode = 403;
    
    constructor(public message: string) {
        super(message);

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }

    serializeErrors() {
        return [{ message: this.message }];
    }
} 