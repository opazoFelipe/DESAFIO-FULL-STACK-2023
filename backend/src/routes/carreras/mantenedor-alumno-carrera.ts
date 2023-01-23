import express from 'express';
import { body, param, query } from 'express-validator';
import { validateRequest, requireRol } from '../../common';

import {
    inscribeAlumnoCarreraHandler,
    eliminaAlumnoCarreraHandler,
    loadMantedorCarreraAlumno,
    listarAlumnosCarrera,
    listartAlumnosAllCarreras,
    loadConsultaCarrerasAlumnos
} from '../../controllers/carreras';

const router = express.Router();

/**
 * API's:
 * get: /api/carreras/alumnos -> Recupera todos los alumnos de todas las carreras
 *  - crr_codigo: Código de la carrera (opcional en query) ?crr_codigo=123
 * - alu_rut: Rut del alumno (opcional en query) ?alu_rut=12345678
 * - escc_codigo: Código de escuela (opcional en query) ?escc_codigo=123
 * - tprc_codigo: Código de tipo de carrera (opcional en query) ?tprc_codigo=123
 * - crr_nombre: Nombre de la carrera (opcional en query) ?crr_nombre=ingenieria
 * 
 * get: /api/carreras/alumnos/:crr_codigo -> Recupera los alumnos de una carrera
 *  - crr_codigo: Código de la carrera
 * - alu_rut: Rut del alumno (opcional en query) ?alu_rut=12345678
 * 
 * post: /api/carreras/alumnos -> Inscribir alumno a una carrera
 * - alu_rut: Rut del alumno
 * - crr_codigo: Código de la carrera
 * 
 * delete: /api/carreras/alumnos/:crr_codigo/:alu_rut -> Elimina un alumno de una carrera
 * - crr_codigo: Código de la carrera
 * - alu_rut: Rut del alumno
 * 
 */

//* >> --------------- Mantenedor de carrera alumnos ------------------------ */
router.get('/api/carreras/alumnos',
    requireRol('/api/carreras/alumnos', 'get'), [
    query('crr_codigo').optional().isNumeric().withMessage('Código de carrera no válido'),
    query('alu_rut').optional().isNumeric().withMessage('Rut de alumno no válido'),
    query('escc_codigo').optional().isNumeric().withMessage('Código de escuela no válido'),
    query('tprc_codigo').optional().isNumeric().withMessage('Código de tipo de carrera no válido'),
    query('crr_nombre').optional().isString().withMessage('Nombre de carrera no válido')
], validateRequest, listartAlumnosAllCarreras);

router.get('/api/carreras/alumnos/:crr_codigo',
    requireRol('/api/carreras/alumnos/:crr_codigo', 'get'), [
    param('crr_codigo').isNumeric().withMessage('Código de carrera no válido'),
    query('alu_rut').optional().isNumeric().withMessage('Rut de alumno no válido'),
], validateRequest, listarAlumnosCarrera);

router.post('/api/carreras/alumnos',
    requireRol('/api/carreras/alumnos', 'post'), [
    body('alu_rut').isNumeric().withMessage('El Rut del alumno es requerido'),
    body('crr_codigo').isNumeric().withMessage('Código de carrera es requerido')
], validateRequest, inscribeAlumnoCarreraHandler);

router.delete('/api/carreras/alumnos/:crr_codigo/:alu_rut',
    requireRol('/api/carreras/alumnos/:crr_codigo/:alu_rut', 'delete'), [
    param('alu_rut').isNumeric().withMessage('El Rut del alumno es requerido'),
    param('crr_codigo').isNumeric().withMessage('Código de carrera es requerido')
], validateRequest, eliminaAlumnoCarreraHandler);

router.get('/api/mantenedor-carrera-alumno/:crr_codigo',
    requireRol('/api/mantenedor-carrera-alumno/:crr_codigo', 'get'), [
    param('crr_codigo').isNumeric().withMessage('Código de carrera no válido'),
], validateRequest, loadMantedorCarreraAlumno);

router.get('/api/consulta-carrera-alumno', requireRol('/api/consulta-carrera-alumno', 'get'), loadConsultaCarrerasAlumnos);
//* << --------------- Mantenedor de carrera alumnos ------------------------ */

export { router as mantenedorCarreraAlumnoRouter };