import axios from 'axios';
import { toast } from 'react-toastify';
import { BadRequestError } from '../errors';

const axiosInstance = axios.create({ baseURL: 'http://localhost:4000/api' });

axiosInstance.defaults.withCredentials = true; // para que se envíe la cookie

axiosInstance.interceptors.response.use(
    (response) => {
        // (201) No retorna data, lo uso para crear
        // (204) No retorna data, lo uso para eliminar
        if (response.status === 201 || response.status === 204) {
            toast.success('Solicitud procesada con éxito', { 
                position: toast.POSITION.TOP_RIGHT 
            });
        }

        // Aqui seguiría el código 200, lo uso solo para listar data al cargar un modulo o componente
        return response;
    },  
    (error) => { 
        if (!error.response || error.response.status === 500) {
            toast.error('No es posible procesar la solicitud, intente nuevamente', {
                position: toast.POSITION.TOP_RIGHT
            });
        }

        // TODO: Si alguien no autorizado hace algo entonces se debe redirigir al logout para que luego se redirija a la página de login????
        if (error.response.status === 401) {
        
        }

        if (error.response.status === 400) {
            const errors = error.response.data.errors;
            throw new BadRequestError(errors);
        }

        // TODO: Manejar el codigo 403
        // (403) Lo uso para especificar que un recurso no puede ser eliminado porque está siendo usado por otro recurso
        if (error.response.status === 403) {
            const { message } = error.response.data.errors[0];
            toast.error(message, {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }
);

export { axiosInstance };
