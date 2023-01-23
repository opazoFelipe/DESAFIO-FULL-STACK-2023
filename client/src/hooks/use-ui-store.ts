import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../store"
import { onOpenModal } from "../store/ui/ui-slice"
import { adminRoutes, alumnosRoutes } from "../routes";


export const useUiStore = () => {

    const dispatch = useDispatch()

    const { isModalOpen } = useSelector((state: RootState) => state.ui)
    const { userRoles } = useSelector((state: RootState) => state.auth);

    const openModal = (): void => {
        dispatch(onOpenModal())
    }

    const getPrivateRoutes = (): any[] => {
        const routes1 = adminRoutes.filter(route => userRoles.includes(route.requiredRol)) || [];
        const routes2 = alumnosRoutes.filter(route => userRoles.includes(route.requiredRol)) || [];

        return [...routes1, ...routes2];
    }

    return {
        //* Properties
        isModalOpen,

        //* Métodos
        openModal,
        getPrivateRoutes
    }

}