import { CustomError } from './custom-error';

export class InteralServerError extends CustomError {
    statusCode = 500;

    constructor(public message: string = 'Ha ocurrido un error inesperado al procesar la solicitud') {
        super('Error interno del servidor');

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, InteralServerError.prototype);
    }

    serializeErrors() {
        return [{ message: this.message }];
    }
}