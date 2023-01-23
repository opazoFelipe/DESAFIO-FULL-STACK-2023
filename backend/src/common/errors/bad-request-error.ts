import { CustomError } from './custom-error';

export class BadRequestError extends CustomError {
    statusCode = 400;
    
    constructor(public message: string, public field?: string) {
        super(message);

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeErrors() {
        if (this.field!) {
            return [{ message: this.message, field: this.field }];
        }
        
        return [{ message: this.message }];
    }
} 

export class MultipleBadRequestError extends CustomError {
    statusCode = 400;
    
    constructor(public errors: { message: string, field: string }[]) {
        super('Error validating request');

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, MultipleBadRequestError.prototype);
    }

    serializeErrors() {
        return this.errors.map(err => {
            return { message: err.message, field: err.field };
        });
    }
}