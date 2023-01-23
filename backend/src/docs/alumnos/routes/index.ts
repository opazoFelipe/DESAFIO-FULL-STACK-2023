const getCarreras = {
    get: {
        tags: ["CRUD Carreras"], 
        description: "Recupera todas las carreras filtradas según parámetros opcionales y además permite paginación",
        operationId: "getCarreras",
        parameters: [
            {
                name: "crr_codigo",
                in: "query",
                description: "Código de la carrera",
                required: false,
                type: "number"
            },
            {
                name: "escc_codigo",
                in: "query",
                description: "Código de la escuela de la carrera",
                required: false,
                type: "number"
            },
            {
                name: "tprc_codigo",
                in: "query",
                description: "´Código del tipo de programa de la carrera",
                required: false,
                type: "number"
            },
            {
                name: "ind_paginado",
                in: "query",
                description: "Indica si se desea paginar o no, se debe enviar con valor = 1 si se desea paginar",
                required: false,
                type: "number",
                minimum: 0,
                maximum: 1
            },
            {
                name: "nro_pagina",
                in: "query",
                description: "Número de página a recuperar, si no se envia es por defecto 1",
                required: false,
                type: "number",
                minimum: 1
            },
            {
                name: "registros_por_pagina",
                in: "query",
                description: "Cantidad de registros por página, si no se envia por defecto es 20",
                required: false,
                type: "number",
                minimum: 1
            }
        ],
        // responses: {
        //     "200": {
        //         description: "Las carreras fueron recuperadas",
        //         content: {
        //             "application/json": {
        //                 schema: {
        //                     type: "object",
        //                     properties: {
        //                         data: {
        //                             type: "array",
        //                             items: {






}