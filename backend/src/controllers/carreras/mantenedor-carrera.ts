import { Request, Response } from 'express';
import sql from 'mssql';

import { getConnection } from '../../db/connection';
import { BadRequestError, InteralServerError, ForbiddenError, MultipleBadRequestError } from '../../common';

const recuperaCarreras = async (req: Request) => {
    const crr_codigo = req.query.crr_codigo || null;
    const crr_nombre = req.query.crr_nombre || null;
    const escc_codigo = req.query.escc_codigo || null;
    const tprc_codigo = req.query.tprc_codigo || null;
    const nro_pagina = req.query.nro_pagina || null;
    const registros_por_pagina = req.query.registros_por_pagina || null;

    const pool = await getConnection();
    const request = new sql.Request(pool)
        .input('crr_codigo', sql.Numeric, crr_codigo)
        .input('crr_nombre', sql.VarChar, crr_nombre)
        .input('escc_codigo', sql.Numeric, escc_codigo)
        .input('tprc_codigo', sql.Numeric, tprc_codigo)
        .input('nro_pagina', sql.Numeric, nro_pagina)
        .input('registros_por_pagina', sql.Numeric, registros_por_pagina);

    const { recordset } = await request.execute(`UNIVERSIDAD.dbo.RECUPERA_CARRERAS`);
    return recordset;
}

export const listarCarreras = async (req: Request, res: Response) => {
    const recordset = await recuperaCarreras(req);
    res.send(recordset);
}

export const crearCarrera = async (req: Request, res: Response) => {
    const { rut } = req.currentUser!;
    const { crr_codigo_old, crr_codigo_new, escc_codigo, tprc_codigo, crr_nombre } = req.body;

    const pool = await getConnection();

    const request = new sql.Request(pool)
        .input('crr_codigo_old', sql.Numeric, crr_codigo_old || null)
        .input('escc_codigo', sql.Numeric, escc_codigo)
        .input('tprc_codigo', sql.Numeric, tprc_codigo)
        .input('crr_nombre', sql.VarChar, crr_nombre.toUpperCase())
        .input('rut_actualizacion', sql.Numeric, rut)
        .input('crr_codigo_new', sql.Numeric, crr_codigo_new);
    
    const { recordset } = await request.execute(`UNIVERSIDAD.dbo.GUARDAR_CARRERA`);

    console.log(recordset)

    /* Se encontro que el tipo programa y escuela carrera no existe (nunca deberia pasar) */
    if (recordset.length > 1) {
        const errors = recordset.map((err: any) => {
            return { message: err.msg_error, field: err.field_error };
        });

        throw new MultipleBadRequestError(errors);
    }

    const { msg_error, field_error, status_code } = recordset[0];

    if (status_code === 200) {
        return res.status(201).send();
    }

    if (status_code === 400) {
        throw new BadRequestError(msg_error, field_error);
    }

    // Significa que la transacción no se pudo realizar
    throw new InteralServerError();
}

export const eliminarCarrera = async (req: Request, res: Response) => {
    const { crr_codigo } = req.params;

    const pool = await getConnection();

    const request = new sql.Request(pool)
        .input('crr_codigo', sql.Numeric, crr_codigo);

    const { recordset } = await request.execute(`UNIVERSIDAD.dbo.ELIMINAR_CARRERA`);

    const { msg_error, status_code } = recordset[0];

    if (status_code === 200) {
        return res.status(204).send();
    }

    // TODO: Actualizar al codigo 409, el recurso no se puede eliminar porque esta siendo utilizado por otro recurso
    if (status_code === 403) {
        throw new ForbiddenError(msg_error);
    }

    // Significa que la transacción no se pudo realizar
    throw new InteralServerError();
}

export const loadMantenedorCarreras = async (req: Request, res: Response) => {
    const pool = await getConnection();

    // Recuperar filtro escuelas
    let result = await pool?.query(`SELECT escc_codigo, escc_nombre FROM UNIVERSIDAD.dbo.ESCUELA_CARRERA WITH(NOLOCK)`);
    const escuelas = result?.recordset;

    // Recuperar filtro programa
    result = await pool?.query(`SELECT tprc_codigo, tprc_nombre FROM UNIVERSIDAD.dbo.TIPO_PROGRAMA_CARRERA WITH(NOLOCK)`);
    const programas = result?.recordset;

    // Recuperar lista carrera
    const carreras = await recuperaCarreras(req);

    res.send({ escuelas, programas, carreras });
}  


