import axios from 'axios';

import { useState } from 'react';
import { IApiErrorResponse } from '../interfaces/apiResponse';
import { BadRequestError } from '../errors';
import { axiosInstance } from '../api/create-axios';

interface IProps {
    url: string;
    method: 'get' | 'post' | 'put' | 'delete';
    body?: {};
    onSuccess?: (data: any) => void;
}

export default () => {
    const [errors, setErrors] = useState<IApiErrorResponse[]>([]);

    const doRequest = async ({ url, method, body, onSuccess }: IProps): Promise<IApiErrorResponse[] | []> => {
        let errors: IApiErrorResponse[] = [];

        try {
            const response = await axiosInstance[method](url, body);
            return response.data;
        } catch (error) {
            if (error instanceof BadRequestError) {
                errors = error.serializeErrors();
            }
        }

        return errors;
    };

    return { doRequest, errors };
}

