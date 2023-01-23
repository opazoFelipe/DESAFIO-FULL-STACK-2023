import { createSlice } from '@reduxjs/toolkit';

export enum EUsuarioRole {
    ADMIN = "ADMIN",
    ALUMNO = "ALUMNO",
}

export enum EAuthStatus {
    AUTHENTICATED = 'authenticated',
    NOT_AUTHENTICATED = 'not-authenticated',
    IS_AUTHENTICATING = 'is-authenticating'
}

const initialState = {
    status: EAuthStatus.NOT_AUTHENTICATED,
    userRoles: [] as any[]
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        onSetCheckingStatus : (state) => {
            state.status = EAuthStatus.IS_AUTHENTICATING;
        },
        onSetLoginStatus : (state, action) => {
            state.status = EAuthStatus.AUTHENTICATED;
            state.userRoles = action.payload;
        },
        onSetLogoutStatus : (state) => {
            state.status = EAuthStatus.NOT_AUTHENTICATED;
            state.userRoles = [];
        },
        onSetRoles : (state, action) => {
            state.userRoles = action.payload;
        }
    }
});

// Action creators are generated for each case reducer function
export const {
    onSetCheckingStatus,
    onSetLoginStatus,
    onSetLogoutStatus,
    onSetRoles,
} = authSlice.actions;
