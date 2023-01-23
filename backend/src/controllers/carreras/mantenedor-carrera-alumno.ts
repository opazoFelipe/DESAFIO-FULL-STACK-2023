import { Request, Response } from 'express';
import sql from 'mssql';

import { getConnection } from '../../db/connection';
import { BadRequestError, ForbiddenError, InteralServerError, MultipleBadRequestError } from '../../common';

export const recuperaAlumnosCarrera = async (req: Request) => {
    const { alu_rut, crr_codigo, escc_codigo, tprc_codigo, crr_nombre, nro_pagina, registros_por_pagina } = req.query;

    const pool = await getConnection();

    /* Recupera la información de la carrera y el alumno? */
    let request = new sql.Request(pool)
        .input('crr_codigo', sql.Numeric, crr_codigo || null)
        .input('alu_rut', sql.Numeric, alu_rut || null)
        .input('escc_codigo', sql.Numeric, escc_codigo || null)
        .input('tprc_codigo', sql.Numeric, tprc_codigo || null)
        .input('crr_nombre', sql.VarChar, crr_nombre || null)
        .input('nro_pagina', sql.Numeric, nro_pagina || null)
        .input('registros_por_pagina', sql.Numeric, registros_por_pagina || null)

    const { recordset } = await request.execute(`UNIVERSIDAD.dbo.RECUPERA_ALUMNOS_CARRERA`);
    return recordset;
}

export const listartAlumnosAllCarreras = async (req: Request, res: Response) => {
    const recordset = await recuperaAlumnosCarrera(req);
    res.status(200).send(recordset);
}

export const listarAlumnosCarrera = async (req: Request, res: Response) => {
    req.query.crr_codigo = req.params.crr_codigo;
    const recordset = await recuperaAlumnosCarrera(req);
    res.status(200).send(recordset);
}

export const inscribeAlumnoCarreraHandler = async (req: Request, res: Response) => {
    const { rut } = req.currentUser!;
    const { alu_rut, crr_codigo } = req.body;

    const pool = await getConnection();

    const request = new sql.Request(pool)
        .input('alu_rut', sql.Numeric, alu_rut)
        .input('crr_codigo', sql.Numeric, crr_codigo)
        .input('login_actualizacion', sql.Numeric, rut)

    const { recordset } = await request.execute(`UNIVERSIDAD.dbo.INSCRIBIR_ALUMNO_CARRERA`);

    /* Se encontro que el alumno y carrera no existen (nunca deberia pasar) */
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

    if (status_code === 403) {
        throw new ForbiddenError(msg_error);
    }

    // Significa que la transacción no se pudo realizar
    throw new InteralServerError();
}

export const eliminaAlumnoCarreraHandler = async (req: Request, res: Response) => {
    const { alu_rut, crr_codigo } = req.params;

    const pool = await getConnection();

    const request = new sql.Request(pool)
        .input('alu_rut', sql.Numeric, alu_rut)
        .input('crr_codigo', sql.Numeric, crr_codigo);

    const { recordset } = await request.execute(`UNIVERSIDAD.dbo.ELIMINAR_ALUMNO_CARRERA`);

    const { msg_error, status_code } = recordset[0];

    if (status_code === 200) {
        return res.status(204).send();
    }

    // Significa que la transacción no se pudo realizar
    throw new InteralServerError();
}

export const loadMantedorCarreraAlumno = async (req: Request, res: Response) => {
    req.query.crr_codigo = req.params.crr_codigo;

    const pool = await getConnection();

    /* Recupera la información de la carrera */
    let request = new sql.Request(pool)
        .input('crr_codigo', sql.Numeric, req.params.crr_codigo)

    const { recordset: recordsetCarrera } = await request.execute(`UNIVERSIDAD.dbo.RECUPERA_CARRERAS`);

    /* Recupera los alumnos de la carrera */
    const recordsetAlumnos = await recuperaAlumnosCarrera(req);

    return res.send({ carrera: recordsetCarrera[0], alumnos: recordsetAlumnos });
}

export const loadConsultaCarrerasAlumnos = async (req: Request, res: Response) => {
    const pool = await getConnection();
    
    /* Recupera las escuelas (filtro) */
    let recordset = await pool?.query(`SELECT escc_codigo, escc_nombre FROM UNIVERSIDAD.dbo.ESCUELA_CARRERA WITH(NOLOCK)`);
    const recordsetEscuelas = recordset?.recordset;
    // Recuperar filtro programa
    recordset = await pool?.query(`SELECT tprc_codigo, tprc_nombre FROM UNIVERSIDAD.dbo.TIPO_PROGRAMA_CARRERA WITH(NOLOCK)`);
    const recordsetProgramas = recordset?.recordset;

    /* Recupera la lista de alumnos */
    const recordsetAlumnos = await recuperaAlumnosCarrera(req);

   /* Por defecto no va a cargar los alumnos para alivianar el peso de la respuesta, el usuario debe hacer click en el botón buscar */
    res.send({ escuelas: recordsetEscuelas, programas: recordsetProgramas, alumnos: recordsetAlumnos });
}