import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Formik, Form as FormikForm, FormikHelpers, FormikValues } from 'formik';
import * as yup from 'yup';
import { MyFormikInputText } from '../../components/common';
import { checkRutField, cleanAndSplitRutByDv, formatedRut } from '../../helpers';
import { axiosInstance } from '../../api';
import { useDispatch } from 'react-redux';
import { onSetLoginStatus, onSetCheckingStatus, onSetLogoutStatus, EUsuarioRole } from '../../store';
import { IApiErrorResponse } from '../../interfaces';
import { BadRequestError } from '../../errors';
import { FaKey } from 'react-icons/fa';
import { useAuthStore } from '../../hooks';

interface FormValues {
    rut: string,
    password: string
}

const formData = {
    rut: '',
    password: '',
}

export const LoginPage = () => {
    const dispatch = useDispatch();

    const handleSubmit = async (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
        let errors: IApiErrorResponse[] = [];
        let roles = [];

        const { password } = values;
        const { rut, dv } = cleanAndSplitRutByDv(values.rut);

        try {
            const { data } = await axiosInstance.post('/auth/login', { rut: `${rut}-${dv}`, password });

            if (data.ind_is_admin === 1) {
                roles.push(EUsuarioRole.ADMIN);
            }
            if (data.ind_is_alumno === 1) {
                roles.push(EUsuarioRole.ALUMNO);
            }
     
            dispatch(onSetLoginStatus(roles));
        }
        catch (error) {
            if (error instanceof BadRequestError) {
                errors = error.serializeErrors();
            }
            dispatch(onSetLogoutStatus());
        }

        if (errors.length > 0) {
            errors.map(error => {
                if (error?.field) {
                    formikHelpers.setErrors({ [error?.field]: error?.message });
                }
            })
        }
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                    <div className="card border-0 shadow rounded-3 my-5">
                        <div className="card-body p-4 p-sm-5">
                            <h5 className="card-title text-center mb-5 fw-light fs-5">Ingrese sus datos</h5>
                            <Formik
                                initialValues={formData}
                                enableReinitialize={true}
                                validate={(values) => {
                                    let errors: FormikValues = {};

                                    if (values.rut) {
                                        const testRut = checkRutField(values.rut);
                                        if (!testRut) {
                                            errors.rut = 'El rut no es válido';
                                        }
                                    }

                                    return errors;
                                }}
                                onSubmit={handleSubmit}
                                validationSchema={yup.object({
                                    rut: yup
                                        .string()
                                        .required('El rut es requerido')
                                        .min(3, 'Ingrese el rut completo'),
                                    password: yup.string().required('La constraseña es requerida'),
                                })}
                            >
                                {
                                    (formik) => (
                                        <FormikForm noValidate>
                                            <MyFormikInputText
                                                name="rut"
                                                type="text"
                                                placeholder="R.U.T"
                                                onChangeInput={(e) => {
                                                    const rut = formatedRut(e.target.value);
                                                    e.target.value = rut;
                                                }}
                                            />
                                            <MyFormikInputText
                                                name="password"
                                                type="password"
                                                placeholder="Contraseña"
                                            />
                                            <Button
                                                variant="primary"
                                                color="primary"
                                                size="sm"
                                                type="submit"
                                                className="w-100 mt-3"
                                            >
                                                Ingresar <FaKey className="ms-2" />
                                            </Button>
                                        </FormikForm>
                                    )
                                }
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
