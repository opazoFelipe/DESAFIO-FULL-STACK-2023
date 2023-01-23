import { axiosInstance } from "./create-axios";

export const getModulos = async () => {
    const { data } = await axiosInstance.post("/api/usuario/modulos");
    return data;
};