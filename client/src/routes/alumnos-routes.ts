import {
    AntecedentesPersonalesAlumno
} from "../components/modulos";

import {
    FaUserAlt
} from "react-icons/fa";
import { EUsuarioRole } from "../store";

export const alumnosRoutes = [
    {
        path: '/mis-antecedentes',
        name: 'Mis Antecedentes',
        Component: AntecedentesPersonalesAlumno,
        MenuIcon: FaUserAlt,
        requiredRol: EUsuarioRole.ALUMNO,
        displaySideBar: true
    },
];




