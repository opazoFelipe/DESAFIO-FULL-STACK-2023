export default {
    // 200
    successResponseSchema: {
        type: "object", // data type
        description: "Respuesta de éxito, no tiene contenido", // desc
    },
    // 400
    badRequestResponseSchema: {
        type: "object", // data type
        description: "Se usa para indicar que el payload enviado no es válido", // desc
        properties: {
            errors:
            {
                type: "array",
                description: "Array de errores",
                items: {
                    type: "object",
                    description: "Información del error",
                    properties: {
                        message: {
                            type: "string",
                            description: "Mensaje del error",
                            example: "El rut es requerido",
                        },
                        field: {
                            type: "string",
                            description: "Campo del error",
                            example: "rut",
                        },
                    },
                },
            },
        },
    },
    // 400
    requestValidationErrorSchema: {
        type: "object", // data type
        description: "Se usa para indicar que el payload enviado no es válido (validaciones de express-validator)", // desc
        properties: {
            errors:
            {
                type: "array",
                description: "Array de errores",
                items: {
                    type: "object",
                    description: "Información del error",
                    properties: {
                        message: {
                            type: "string",
                            description: "Mensaje del error",
                            example: "El rut es requerido",
                        },
                        field: {
                            type: "string",
                            description: "Campo del error",
                            example: "rut",
                        },
                    },
                },
            },
        },
    },
    // 401
    notAuthorizedResponseSchema: {
        type: "object", // data type
        description: "Se usa para indicar que el usuario no está autorizado para realizar la acción", // desc
        properties: {
            errors:
            {
                type: "array",
                description: "Array de errores",
                items: {
                    type: "object",
                    description: "Información del error",
                    properties: {
                        message: {
                            type: "string",
                            description: "Mensaje del error",
                            example: "Not authorized",
                        },
                    },
                },
            },
        },
    },
    // 403
    forbiddenResponseSchema: {
        type: "object", // data type
        description: "Se usa para indicar el usuario no puede realizar ciertas acciones pues violan las reglas de negociod de la base de datos", // desc
        properties: {
            errors:
            {
                type: "array",
                description: "Array de errores",
                items: {
                    type: "object",
                    description: "Información del error",
                    properties: {
                        message: {
                            type: "string",
                            description: "Mensaje del error",
                            example: "La carrera no puede ser eliminada porque tiene alumnos inscritos",
                        },
                    },
                },
            },
        },
    },
    // 404
    notFoundResponseSchema: {
        type: "object", // data type
        description: "Se usa para indicar que el recurso no fue encontrado, en este proyecto solo se usa para devolver una respuesta de error cuando se solicita una ruta que no existe", // desc
        properties: {
            errors:
            {
                type: "array",
                description: "Array de errores",
                items: {
                    type: "object",
                    description: "Información del error",
                    properties: {
                        message: {
                            type: "string",
                            description: "Mensaje del error",
                            example: "Not Found",
                        },
                    },
                },
            },
        },
    },
    // 500
    internalServerErrorResponseSchema: {
        type: "object", // data type
        description: "Se usa para indicar que ocurrió un error interno en el servidor", // desc
        properties: {
            errors:
            {
                type: "array",
                description: "Array de errores",
                items: {
                    type: "object",
                    description: "Información del error",
                    properties: {
                        message: {
                            type: "string",
                            description: "Mensaje del error",
                            example: "Ocurrio un error inexperado al procesar la solicitud", 
                        },
                    },
                },
            },
        },
    },
}