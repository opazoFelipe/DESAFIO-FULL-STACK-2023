export default {
    createUserResponseSchema: {
        type: "object", // data type
        description: "Respuesta de la creacion de un usuario", // desc
        properties: {
            user: {
                type: "object", // data type
                description: "Usuario creado", // desc
                properties: {
                    uid: {
                        $ref: "#/components/schemas/_id", // Id model,
                    },
                    name: {
                        $ref: "#/components/schemas/userName", // Id model,
                    },
                    email: {
                        $ref: "#/components/schemas/userEmail", // Id model,
                    },
                    password: {
                        $ref: "#/components/schemas/userPassword", // Id model,
                    },
                    image: {
                        $ref: "#/components/schemas/userImage", // Id model,

                    },
                    cellphone: {
                        $ref: "#/components/schemas/userCellphone", // Id model,
                    },
                },
            },
            token: {
                type: "string", // data type
                description: "Token de autenticacion", // desc
            }
        },
    },
}