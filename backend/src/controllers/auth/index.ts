import { Request, Response } from 'express';
import sql from 'mssql';
import jwt from 'jsonwebtoken';

import { environment } from '../../environment';
import { BadRequestError } from '../../common';
import { getConnection } from '../../db/connection';
import { Password } from '../../common/helpers';

export const loginHandler = async (req: Request, res: Response) => {
    const { rut, password } = req.body;

    const [usu_rut, rutDV] = rut.split('-');

    const pool = await getConnection();
    let request = new sql.Request(pool)
        .input('usu_rut', sql.Numeric, usu_rut);

    const { recordset } = await request.execute(`UNIVERSIDAD.dbo.RECUPERA_PASSWORD_USUARIO`);

    if (recordset.length === 0) {
        throw new BadRequestError('Rut no válido', 'rut');
    }

    const { usu_password } = recordset[0];

    const passwordsMatch = await Password.compare(password, usu_password);

    if (!passwordsMatch) {
        throw new BadRequestError('Contraseña incorrecta', 'password');
    }

    request = new sql.Request(pool)
        .input('usu_rut', sql.Numeric, usu_rut);

    const { recordset: recordsetRol } = await request.execute(`UNIVERSIDAD.dbo.IDENTIFICA_ROL_USUARIO`);
    const [{ ind_is_admin, ind_is_alumno }] = recordsetRol;

    const token = jwt.sign({
        rut
    }, environment.JWT_SECRET!);

    req.session = {
        jwt: token
    };

    res.status(200).send({ ind_is_admin, ind_is_alumno });
}

export const logoutHandler = async (req: Request, res: Response) => {
    req.session = null;

    res.status(200).send();
}
