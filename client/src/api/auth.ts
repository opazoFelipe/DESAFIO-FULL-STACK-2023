import { axiosInstance } from "./create-axios";
import { ILogin } from "../interfaces/usuario";

export const apiLogin = ({ rut, password }: ILogin) => axiosInstance.post("/auth/login", { rut, password });
