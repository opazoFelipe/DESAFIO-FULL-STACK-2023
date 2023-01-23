import { configureStore } from '@reduxjs/toolkit';
import { uiSlice } from './ui/ui-slice';
import { authSlice } from './auth/auth-slice';
import { usuarioSlice } from './usuario/usuario-slice';

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        ui: uiSlice.reducer,
        usuario: usuarioSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

// Inferred type: {auth: AuthState, ui: UiState, usuario: UsuarioState}
export type AppDispatch = typeof store.dispatch