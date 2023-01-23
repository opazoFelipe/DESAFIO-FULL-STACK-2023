import { Request, request, response, Response, NextFunction } from 'express';
import sql from 'mssql';

import { getConnection } from '../../db/connection';
import { NotAuthorizedError } from '../errors';

export const requireRol = (serviceUrl: string, serviceMethod: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const pool = await getConnection();
        const { recordset } = await pool!.request()
            .input('usu_rut', sql.Numeric, req.currentUser?.rut)
            .input('servicio_url', sql.VarChar, serviceUrl)
            .input('http_method', sql.VarChar, serviceMethod)
            .execute('UNIVERSIDAD.dbo.IDENTIFICA_ROL_USUARIO_CONSUMIDOR_SERVICIO_SISTEMA');
        
        if (recordset[0].ind_tiene_rol !== 1) {
            throw new NotAuthorizedError();
        }

        next();
    }
}




