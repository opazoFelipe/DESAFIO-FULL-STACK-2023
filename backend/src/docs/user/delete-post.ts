export default {
    // method of operation
    delete: {
        tags: ["Posts CRUD operations"], // operation's tag.
        description: "Elimina un post", // operation's desc.
        operationId: "deletePost", // unique operation id.
        parameters: [
            {
                name: "id", // name of the param
                in: "path", // location of the param
                schema: {
                    $ref: "#/components/schemas/_id", // id model
                },
                required: true, // Mandatory param
                description: "Id del post a eliminar", // param desc.
            },
        ],
        // expected responses
        responses: {
            // response code
            200: {
                description: "El Post fue eliminado", // response desc.
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