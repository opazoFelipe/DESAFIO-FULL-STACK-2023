import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { LoginPage } from '../auth/pages';
import { useAuthStore } from '../hooks';

export const PublicRoutes = () => {

    const { onStartingCheckAuthStatus, status } = useAuthStore();

    console.log('ruta publica')
    
    return (
        <Routes>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/*' element={<Navigate to="/login" replace />} />
        </Routes>
    )
}
