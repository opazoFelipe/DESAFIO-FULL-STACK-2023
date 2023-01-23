import { IApiErrorResponse } from "../interfaces/apiResponse";

export class BadRequestError extends Error {
    constructor(public errors: IApiErrorResponse[]) {
        super('Error validating request');

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeErrors() {
        return this.errors;
    }
}
