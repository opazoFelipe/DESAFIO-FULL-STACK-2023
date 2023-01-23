export default {
    CarreraPayload: {
        type: "object", // data type
        description: "Payload para la creacion o actualización de una carrera", // desc
        properties: {
            crr_codigo_new: {
                type: "number",
                required: true,
                description: "Codigo de la carrera",
                example: "1",
            },
            escc_codigo: {
                type: "number",
                required: true,
                description: "Codigo de la escuela de la carrera",
                example: "1",
            },
            tprc_codigo: {
                type: "number",
                required: true,
                description: "Codigo del tipo de programa de la carrera",
                example: "1",
            },
            crr_nombre: {
                type: "string",
                required: true,
                description: "Nombre de la carrera",
                example: "Ingeniería en Sistemas",
            },
            ind_activa: {
                type: "number",
                required: true,
                description: "Indicador de si la carrera esta activa (1 | 0), solo de utilidad",
                example: "1",
            }
        },
    },
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