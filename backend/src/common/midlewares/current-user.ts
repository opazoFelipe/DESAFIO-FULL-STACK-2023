import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { environment } from '../../environment';

interface UserPayload {
    rut: string;
}

//* Extiende el Request de Express de manera global
declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session?.jwt) {
        return next();
    }

    try {
        const payload = jwt.verify(req.session.jwt, environment.JWT_SECRET!) as UserPayload;
        req.currentUser = payload;
    } catch (err) { }

    next();
}
