import { createSlice } from '@reduxjs/toolkit';

import { IBackButtonLastData } from '../../interfaces';

const initialBackButtonLastData: IBackButtonLastData = {
    simpleFiltros: {},
    complexData: {},
}

export const usuarioSlice = createSlice({
    name: 'usuario',
    initialState: {
        backButtonLastData: initialBackButtonLastData
    },
    reducers: {
        onsSetBackButtonLastData: (state, action) => {
            state.backButtonLastData = action.payload
        },
        onClearBackButtonLastData: (state) => {
            state.backButtonLastData = initialBackButtonLastData
        },
    }
})

export const {  
    onsSetBackButtonLastData, 
    onClearBackButtonLastData, 
} = usuarioSlice.actions