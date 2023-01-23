import { useDispatch, useSelector } from "react-redux"

import { onSetLoginStatus, RootState, EAuthStatus, EUsuarioRole, onSetRoles, onSetLogoutStatus, onSetCheckingStatus } from "../store"
import { useEffect } from "react";
import { axiosInstance } from "../api";

export const useAuthStore = () => {
    const dispatch = useDispatch();
    const { status, userRoles } = useSelector((state: RootState) => state.auth);

    const onStartingCheckAuthStatus = async () => {
        const roles = [];

        try {
            const response = await axiosInstance.get('/auth/current-user');

            if (response) {

                if (response.data.currentUser) {
                    if (response.data.roles.ind_is_admin === 1) {
                        roles.push(EUsuarioRole.ADMIN);
                    }

                    if (response.data.roles.ind_is_alumno === 1) {
                        roles.push(EUsuarioRole.ALUMNO);
                    }     
                    dispatch(onSetLoginStatus(roles));
                }

            }
        } catch (error) {
            console.log(error)
            dispatch(onSetLogoutStatus());
        }
    }

    const onStartingLogout = async () => {
        localStorage.removeItem('token');
        await axiosInstance.post("/auth/logout");
        dispatch(onSetLogoutStatus());
    }

    return {
        //* Properties
        userRoles,
        status,

        //* Métodos
        onStartingCheckAuthStatus,
        onStartingLogout
    }
}