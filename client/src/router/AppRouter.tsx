import React, { useEffect } from 'react'

import { PublicRoutes, PrivateRoutes } from '../routes'
import { useAuthStore } from '../hooks';
import { EAuthStatus, onSetLoginStatus } from '../store';
import { useDispatch } from 'react-redux';
import { useCheckAuth } from '../hooks/use-check-auth';

export const AppRouter = () => {

    const status = useCheckAuth();

    if (status === EAuthStatus.IS_AUTHENTICATING) {
        return <div className="spinner-border text-primary" role="status"></div>
    }
    
    return (
        <>
            {
                status === EAuthStatus.AUTHENTICATED
                    ? <PrivateRoutes />
                    : <PublicRoutes />
            }
        </>
    )
}
