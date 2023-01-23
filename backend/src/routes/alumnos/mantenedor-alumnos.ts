import express from 'express';
import { body, param, query } from 'express-validator';
import { validateRequest, requireRol } from '../../common';

import { crearAlumno, eliminarAlumno, listarAlumnos, loadMantenedorAlumnos } from '../../controllers/alumnos';

const router = express.Router();

router.get('/api/alumnos', requireRol('/api/alumnos', 'get'), [
    query('alu_rut').optional().isNumeric().withMessage('El Rut no es válido'),
    query('alu_nombres').optional().isString().withMessage('El nombre no es válido'),
    query('alu_apellido_paterno').optional().isString().withMessage('El apellido paterno no es válido'),
    query('alu_apellido_materno').optional().isString().withMessage('El apellido materno no es válido'),
    query('nro_pagina').optional().isNumeric().withMessage('El numero de pagina no es válido'),
    query('registros_por_pagina').optional().isNumeric().withMessage('El numero de registros no es válido')
], validateRequest, listarAlumnos);

/* Guarda y Actualiza, la logica esta en el SP */
router.post('/api/alumnos', requireRol('/api/alumnos', 'post'), [
    body('alu_rut_new').isNumeric().withMessage('El Rut es requerido'),
    body('alu_dv').isString().withMessage('El digito verificador es requerido'),
    body('alu_nombres').isString().withMessage('El nombre es requerido'),
    body('alu_apellido_paterno').isString().withMessage('El apellido paterno es requerido'),
    body('alu_apellido_materno').isString().withMessage('El apellido materno es requerido'),
    body('alu_email').optional().isEmail().withMessage('El email no es válido'),
    body('alu_celular').optional().isNumeric().withMessage('El celular no es válido'),
    body('anio_ingreso_universidad').optional().isNumeric().withMessage('El año de ingreso no es válido'),
    body('periodo_ingreso_universidad').optional().isNumeric().withMessage('El periodo de ingreso no es válido')
], validateRequest, crearAlumno);

router.delete('/api/alumnos/:alu_rut', requireRol('/api/alumnos/:alu_rut', 'delete'), [
    param('alu_rut').isNumeric().withMessage('El Rut es requerido')
], validateRequest, eliminarAlumno);

router.get('/api/mantenedor-alumnos', requireRol('/api/mantenedor-alumnos', 'get'), [
    // A estos dos siguientes nunca se debe llegar, el cliente debe controlar estos parametros
    query('nro_pagina').optional().isNumeric().withMessage('Número de página no válido'),
    query('registros_por_pagina').optional().isNumeric().withMessage('Número de registros no válido'),
], validateRequest, loadMantenedorAlumnos);

export { router as mantenedorAlumnosRouter };