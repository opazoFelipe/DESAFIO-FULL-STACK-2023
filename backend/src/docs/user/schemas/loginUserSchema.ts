export default {
    loginUserSchema: {
        type: "object", // data type
        description: "Payload para la autenticación de un usuario", // desc
        properties: {
            email: {
                $ref: "#/components/schemas/userEmail", // Id model,
                required: true,
            },
            password: {
                $ref: "#/components/schemas/userPassword", // Id model,
                required: true,
            },
        },
    }
}