export default {
    // method of operation
    post: {
        tags: ["User Login operations"], // operation's tag.
        description: "Autentica un usuario", // operation's desc.
        operationId: "loginUser", // unique operation id.
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/loginUserSchema", // Post Input
                    },
                },
            },
        },
        // expected responses
        responses: {
            // response code
            200: {
                description: "Las credenciales son correctas", // response desc.
                content: {
                    // content-type
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/createUserSchema", // Post model
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
            404: {
                description: "Las credenciales no son correctas", // response desc.
                content: {
                    // content-type
                    "application/json": {
                        schema: {
                            type: "object", // data type
                            properties: {
                                message: {
                                    type: "string",
                                    description: "Mensaje de error",
                                    example: "El email no existe",
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