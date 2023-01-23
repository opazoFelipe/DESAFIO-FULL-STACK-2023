import { EUsuarioRole } from "../store";

import {
    MantenedorAlumnos,
    MantenedorCarreras,
    MantenedorAlumnoCarrera,
    ConsultaAlumnosCarrera
} from "../components/modulos";

import {
    FaClipboardList,
    FaGraduationCap,
    FaUserGraduate
} from "react-icons/fa";


export const adminRoutes = [
    {
        path: '/admin/carreras',
        name: 'Mantenedor Carreras',
        Component: MantenedorCarreras,
        MenuIcon: FaGraduationCap,
        requiredRol: EUsuarioRole.ADMIN,
        displaySideBar: true
    },
    {
        path: '/admin/alumnos',
        name: 'Mantenedor Alumnos',
        Component: MantenedorAlumnos,
        MenuIcon: FaClipboardList,
        requiredRol: EUsuarioRole.ADMIN,
        displaySideBar: true
    },
    {
        path: '/carreras/alumnos/:crr_codigo',
        name: 'Alumnos Carrera',
        Component: MantenedorAlumnoCarrera,
        MenuIcon: FaUserGraduate,
        requiredRol: EUsuarioRole.ADMIN,
        displaySideBar: false
    },
    {
        path: '/',
        name: 'Consulta Alumnos Carrera',
        Component: ConsultaAlumnosCarrera,
        MenuIcon: FaUserGraduate, 
        requiredRol: EUsuarioRole.ADMIN,
        displaySideBar: true,
    }
];




