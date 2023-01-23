import express from 'express';

import { serviciosUsuarioHandler, currentUserHandler, rolesUsuarioHandler } from '../../controllers/usuario';
import { validateRequest } from '../../common';

const router = express.Router();

router.get('/api/auth/current-user', currentUserHandler);
router.get('/api/usuario/servicios', validateRequest, serviciosUsuarioHandler);
router.get('/api/usuario/roles', validateRequest, rolesUsuarioHandler);

export { router as usuarioRouter };