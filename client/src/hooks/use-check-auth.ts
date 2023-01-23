import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { axiosInstance } from '../api';
import { EUsuarioRole, RootState, onSetCheckingStatus, onSetLoginStatus, onSetLogoutStatus } from '../store';

export const useCheckAuth = () => {
    const { status, userRoles } = useSelector((state: RootState) => state.auth);

    const dispatch = useDispatch()

    const onStartingCheckAuthStatus = async () => {
        const roles = [];
        dispatch(onSetCheckingStatus());

        try {

            const response = await axiosInstance.get('/auth/current-user');

            if (response.data.roles.ind_is_admin === 1) {
                roles.push(EUsuarioRole.ADMIN);
            }

            if (response.data.roles.ind_is_alumno === 1) {
                roles.push(EUsuarioRole.ALUMNO);
            }

            dispatch(onSetLoginStatus(roles));
            return;
        } catch (error) {
            console.log(error)
        } 

        dispatch(onSetLogoutStatus());
    }

    useEffect(() => {
        onStartingCheckAuthStatus();
    }, [])

    return status
}