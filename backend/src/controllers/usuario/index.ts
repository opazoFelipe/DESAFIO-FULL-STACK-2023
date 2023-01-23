import { Request, Response } from 'express';
import sql from 'mssql';

import { getConnection } from '../../db/connection';

export const currentUserHandler = async (req: Request, res: Response) => {
    const response = { currentUser: req.currentUser || null, roles: {} };

    if (req.currentUser) {
        const pool = await getConnection();
        const [usu_rut] = req.currentUser.rut.split('-');
        const request = new sql.Request(pool)
            .input('usu_rut', sql.Numeric, usu_rut);
        const { recordset } = await request.execute(`UNIVERSIDAD.dbo.IDENTIFICA_ROL_USUARIO`);
        const [{ ind_is_admin, ind_is_alumno }] = recordset;
        response.roles = { ind_is_admin, ind_is_alumno };
    }

    res.send(response)
}

export const serviciosUsuarioHandler = async (req: Request, res: Response) => {
    const { rut } = req.currentUser!;

    const pool = await getConnection();
    const request = new sql.Request(pool)
        .input('usu_rut', sql.Numeric, rut);

    const { recordset } = await request.execute(`UNIVERSIDAD.dbo.RECUPERA_SERVICIOS_SEGUN_ROL`);

    res.status(200).send(recordset);
}

export const rolesUsuarioHandler = async (req: Request, res: Response) => {
    const { rut } = req.currentUser!;
    const [usu_rut] = rut.split('-');

    const pool = await getConnection();
    const request = new sql.Request(pool)
        .input('usu_rut', sql.Numeric, usu_rut);

    const { recordset } = await request.execute(`UNIVERSIDAD.dbo.IDENTIFICA_ROL_USUARIO`);
    const [{ ind_is_admin, ind_is_alumno }] = recordset;

    res.status(200).send({ ind_is_admin, ind_is_alumno });
}


