import React, { useEffect } from 'react'
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'

import { adminRoutes, alumnosRoutes } from './';
import { AppPage } from '../pages/AppPage';
import { useAuthStore, useUiStore } from '../hooks';
import { EAuthStatus, EUsuarioRole } from '../store';
import {
    ConsultaAlumnosCarrera,
    MantenedorAlumnoCarrera,
    MantenedorAlumnos,
    MantenedorCarreras,
    AntecedentesPersonalesAlumno
} from '../components/modulos';
import { useCheckAuth } from '../hooks/use-check-auth';

const routes = [
    ...adminRoutes,
    ...alumnosRoutes
]

export const PrivateRoutes = () => {

    const { getPrivateRoutes } = useUiStore();
    const routes = getPrivateRoutes();

    return (
        <AppPage>
            <Routes>
                {
                    routes.map(({ path, Component }) => (
                        <Route
                            key={path}
                            path={path}
                            element={<Component />}
                        />
                    ))
                }
                {
                    routes.length > 0 && (
                        <Route path="/*" element={<Navigate to={routes[0].path} replace />} />
                    )
                }
            </Routes>

        </AppPage>
    )
}

