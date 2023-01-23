export default {
    // method of operation
    patch: {
        tags: ["Posts CRUD operations"], // operation's tag.
        description: "Actualiza un post", // operation's desc.
        operationId: "updatePost", // unique operation id.
        parameters: [
            {
                name: "id", // name of the param
                in: "path", // location of the param
                schema: {
                    $ref: "#/components/schemas/_id", // id model   
                },
                required: true, // Mandatory param
                description: "Id del post a actualizar", // param desc.
            },
        ],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/PostPayload", // Post Input
                    },
                },
            },
        },
        // expected responses
        responses: {
            // response code
            200: {
                description: "El Post fue actualizado", // response desc.
                content: {
                    // content-type
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/Post", // Post model
                        },
                    },
                },
            },
            409: {
                description: "Error en el servidor", // response desc.
                content: {
                    // content-type
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/ErrorResponse", // Error model
                        }
                    }
                }
            }
        },
    },
};