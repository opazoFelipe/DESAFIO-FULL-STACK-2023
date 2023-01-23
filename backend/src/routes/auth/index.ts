import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../../common';

import { loginHandler, logoutHandler } from '../../controllers/auth';

const router = express.Router();

router.post('/api/auth/login', [
    body('rut').isString().notEmpty().withMessage('El rut es requerido'),
    body('password').trim().notEmpty().withMessage('La contraseña es requerida')
], validateRequest, loginHandler);

router.post('/api/auth/logout', logoutHandler);

export { router as authRouter };