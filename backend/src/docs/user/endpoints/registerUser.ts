export default {
    // method of operation
    post: {
        tags: ["User CRUD operations"], // operation's tag.
        description: "Crea un usuario", // operation's desc.
        operationId: "registerUser", // unique operation id.
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/createUserSchema", // Post Input
                    },
                },
            },
        },
        // expected responses
        responses: {
            // response code
            201: {
                description: "El usuario fue creado", // response desc.
                content: {
                    // content-type
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/createUserResponseSchema", // Post model
                        },
                    },
                },
            },
            400: {
                description: "Error en el payload de la petición", // response desc.
                content: {
                    // content-type
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/expressValidatorErrorResponseSchema", // Error model
                        },
                    },
                },
            },
            422: {
                description: "El recurso ya existe", // response desc.
                content: {
                    // content-type
                    "application/json": {
                        schema: {
                            type: "object", // data type
                            properties: {
                                message: {
                                    type: "string",
                                    description: "Mensaje de error",
                                    example: "El email ya existe",
                                },
                            }
                        },
                    },
                },
            },
            500: {
                description: "Error en el servidor", // response desc.
                content: {
                    // content-type
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/internalServerErrorResponse", // Error model
                        }
                    }
                }
            }
        },
    },
};