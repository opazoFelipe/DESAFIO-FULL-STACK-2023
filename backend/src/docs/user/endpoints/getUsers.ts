export default {
    // method of operation
    get: {
        tags: ["Posts CRUD operations"], // operation's tag.
        description: "Recupera todos los Posts", // operation's desc.
        operationId: "getPosts", // unique operation id.
        parameters: [], // expected params.
        // expected responses
        responses: {
            // response code
            200: {
                description: "Los Posts fueron recuperados", // response desc.
                content: {
                    // content-type
                    "application/json": {
                        schema: {
                            type: "array",
                            items: {
                                // $ref: "#/components/schemas/Post", // Post model
                            }
                        },
                    },
                },
            },
            400: {
                description: "Error en el servidor", // response desc.
                content: {
                    // content-type
                    "application/json": {
                        schema: {
                            // $ref: "#/components/schemas/ErrorResponse", // Error model
                        }
                    }
                }
            }
        },
    },
};