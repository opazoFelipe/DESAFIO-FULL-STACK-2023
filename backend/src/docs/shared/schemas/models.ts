export default {
    CarreraModel: {
        type: "object", // data type
        description: "Modelo de una Carrera que se envia al cliente", // desc
        properties: {
            crr_codigo: {
                type: "number",
                description: "Codigo de la carrera",
                example: "1",
            },
            escc_codigo: {
                type: "number",
                description: "Codigo de la escuela de la carrera",
                example: "1",
            },
            tprc_codigo: {
                type: "number",
                description: "Codigo del tipo de programa de la carrera",
                example: "1",
            },
            crr_nombre: {
                type: "string",
                description: "Nombre de la carrera",
                example: "Ingeniería en Sistemas",
            },
        },
    },
}