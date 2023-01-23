import { Request, Response } from 'express';
import sql from 'mssql';

import { getConnection } from '../../db/connection';
import { BadRequestError, ForbiddenError, InteralServerError } from '../../common';
import { Password } from '../../common/helpers';

const recuperaAlumnos = async (req: Request) => {
    const alu_rut = req.query.alu_rut || null;
    const alu_nombres = req.query.alu_nombres || null;
    const alu_apellido_paterno = req.query.alu_apellido_paterno || null;
    const alu_apellido_materno = req.query.alu_apellido_materno || null;
    const nro_pagina = req.query.nro_pagina || null;
    const registros_por_pagina = req.query.registros_por_pagina || null;

    const pool = await getConnection();
    const request = new sql.Request(pool)
        .input('alu_rut', sql.Numeric, alu_rut)
        .input('alu_nombres', sql.VarChar, alu_nombres)
        .input('alu_apellido_paterno', sql.VarChar, alu_apellido_paterno)
        .input('alu_apellido_materno', sql.VarChar, alu_apellido_materno)
        .input('nro_pagina', sql.Numeric, nro_pagina)
        .input('registros_por_pagina', sql.Numeric, registros_por_pagina);

    const { recordset } = await request.execute(`UNIVERSIDAD.dbo.RECUPERA_ALUMNOS`);
    return recordset;
}

export const listarAlumnos = async (req: Request, res: Response) => {
    const recordset = await recuperaAlumnos(req);
    res.send(recordset);
}

export const crearAlumno = async (req: Request, res: Response) => {
    const { rut } = req.currentUser!;
    const { alu_rut_new, alu_dv, alu_rut_old, alu_nombres, alu_apellido_paterno, alu_apellido_materno,
        alu_email, alu_celular, anio_ingreso_universidad, periodo_ingreso_universidad } = req.body;

    const aluRutString = alu_rut_new.toString();
    let ultimos4Digitos = '';

    if (aluRutString.length < 5) {
        ultimos4Digitos = aluRutString;
    } else {
        ultimos4Digitos = aluRutString.substr(-4);
    }

    const password = await Password.hashPassword(ultimos4Digitos);

    const pool = await getConnection();

    const request = new sql.Request(pool)
        .input('alu_rut_old', sql.Numeric, alu_rut_old || null)
        .input('alu_rut_new', sql.Numeric, alu_rut_new)
        .input('alu_dv', sql.Char, alu_dv)
        .input('alu_nombres', sql.VarChar, alu_nombres.toUpperCase())
        .input('alu_apellido_paterno', sql.VarChar, alu_apellido_paterno.toUpperCase())
        .input('alu_apellido_materno', sql.VarChar, alu_apellido_materno.toUpperCase())
        .input('password_encriptada', sql.VarChar, password)
        .input('login_actualizacion', sql.Numeric, rut)
        .input('alu_email', sql.VarChar, alu_email ? alu_email.toUpperCase() : null)
        .input('alu_celular', sql.Numeric, alu_celular)
        .input('anio_ingreso_universidad', sql.Numeric, anio_ingreso_universidad)
        .input('periodo_ingreso_universidad', sql.Numeric, periodo_ingreso_universidad);

    const { recordset } = await request.execute(`UNIVERSIDAD.dbo.GUARDAR_ALUMNO`);

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

export const eliminarAlumno = async (req: Request, res: Response) => {
    const { alu_rut } = req.params;

    const pool = await getConnection();
    const request = new sql.Request(pool)
        .input('alu_rut', sql.Numeric, alu_rut);

    const { recordset } = await request.execute(`UNIVERSIDAD.dbo.ELIMINAR_ALUMNO`);
    const { msg_error, status_code } = recordset[0];

    if (status_code === 200) {
        return res.status(204).send();
    }

    if (status_code === 403) {
        throw new ForbiddenError(msg_error);
    }
    // Significa que la transacción no se pudo realizar
    throw new InteralServerError();
}

export const loadMantenedorAlumnos = async (req: Request, res: Response) => {
    // Recuperar lista alumnos
    const alumnos = await recuperaAlumnos(req);

    res.send({ alumnos });
}  

