export default {
    uid: {
        type: "string", // data type
        description: "Id del usuario", // desc
        example: "123456", // example of a completed value,
        tags: ['User CRUD operations']
    },
    userName: {
        type: "string", // data type
        description: "Nombre de usuario", // desc
        example: "Felipe Antonio Opazo Rivas", // example of a title
        tags: ['User CRUD operations']
    },
    userEmail: {
        type: "string", // data type
        description: "Email del usuario", // desc
        example: "correo@correo.com",
        tags: ['User CRUD operations']
    },
    userPassword: {
        type: "string", // data type
        description: "Contraseña del usuario", // desc
        example: "123456", // example of a completed value,
        tags: ['User CRUD operations']
    },
    userImage: {
        type: "string", // data type
        description: "Imagen del usuario", // desc
        example: "https://picsum.photos/200", // example of a completed value,
        tags: ['User CRUD operations']
    },
    userCellphone: {
        type: "string", // data type
        description: "Celular del usuario", // desc
        example: "+569 12345678", // example of a completed value,
        tags: ['User CRUD operations']
    },
}