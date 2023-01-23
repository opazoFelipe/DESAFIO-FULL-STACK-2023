export default {
    createUserSchema: {
        type: "object", // data type
        description: "Payload para la creacion o actualización de un usuario", // desc
        properties: {
            name: {
                $ref: "#/components/schemas/userName", // Id model,
                required: true,
            },
            email: {
                $ref: "#/components/schemas/userEmail", // Id model,
                required: true,
            },
            password: {
                $ref: "#/components/schemas/userPassword", // Id model,
                required: true,
            },
            image: {
                $ref: "#/components/schemas/userImage", // Id model,
                required: false,
            },
            cellphone: {
                $ref: "#/components/schemas/userCellphone", // Id model,
                required: false,
            }
        },
    }
}