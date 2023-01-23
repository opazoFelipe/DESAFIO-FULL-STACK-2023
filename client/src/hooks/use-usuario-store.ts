import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../store";
import { onsSetBackButtonLastData, onClearBackButtonLastData } from "../store/usuario/usuario-slice";
import { IBackButtonLastData } from "../interfaces";

export const useUsuarioStore = () => {

    const dispatch = useDispatch()

    const { backButtonLastData } = useSelector((state: RootState) => state.usuario);

    const onStartingSetBackButtonLastData = (backButtonLastData: IBackButtonLastData): void => {
        dispatch(onsSetBackButtonLastData(backButtonLastData))
    }

    const onStartingClearBackButtonLastData = (): void => {
        dispatch(onClearBackButtonLastData());
    }

    return {
        //* Properties
        backButtonLastData,

        //* Métodos
        onStartingClearBackButtonLastData,
        onStartingSetBackButtonLastData
    }

}