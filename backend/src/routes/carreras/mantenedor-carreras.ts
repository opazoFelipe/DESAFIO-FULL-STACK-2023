import express from 'express';
import { body, param, query } from 'express-validator';
import { validateRequest, requireRol } from '../../common';

import {
    crearCarrera,
    eliminarCarrera,
    listarCarreras,
    loadMantenedorCarreras,
    loadMantedorCarreraAlumno
} from '../../controllers/carreras';

const router = express.Router();

//* >> --------------- Mantenedor de carrera ------------------------ */
router.get('/api/carreras', requireRol('/api/carreras', 'get'), [
    query('crr_codigo').optional().isNumeric().withMessage('Código de carrera no válido'),
    query('escc_codigo').optional().isNumeric().withMessage('Escuela carrera no válida'),
    query('tprc_codigo').optional().isNumeric().withMessage('Programa carrera no válido'),
    // A estos dos siguientes nunca se debe llegar, el cliente debe controlar estos parametros
    query('nro_pagina').optional().isNumeric().withMessage('Número de página no válido'),
    query('registros_por_pagina').optional().isNumeric().withMessage('Número de registros no válido'),
], validateRequest, listarCarreras);

/* Guarda y Actualiza, la logica esta en el SP */
router.post('/api/carreras', requireRol('/api/carreras', 'post'), [
    body('crr_codigo_new').isNumeric().withMessage('Código de carrera es requerido'),
    body('escc_codigo').isNumeric().withMessage('Escuela carrera es requerido'),
    body('tprc_codigo').isNumeric().withMessage('Programa carrera es requerido'),
    body('crr_nombre').notEmpty().isString().withMessage('Nombre de carrera es requerido')
], validateRequest, crearCarrera);

router.delete('/api/carreras/:crr_codigo', requireRol('/api/carreras/:crr_codigo', 'delete'), [
    param('crr_codigo').isNumeric().withMessage('Código de carrera es requerido'),
], validateRequest, eliminarCarrera);

router.get('/api/mantenedor-carreras', requireRol('/api/mantenedor-carreras', 'get'), [
    // A estos dos siguientes nunca se debe llegar, el cliente debe controlar estos parametros
    query('nro_pagina').optional().isNumeric().withMessage('Número de página no válido'),
    query('registros_por_pagina').optional().isNumeric().withMessage('Número de registros no válido'),
], validateRequest, loadMantenedorCarreras);
//* << --------------- Mantenedor de carrera ------------------------ */

export { router as mantenedorCarrerasRouter };