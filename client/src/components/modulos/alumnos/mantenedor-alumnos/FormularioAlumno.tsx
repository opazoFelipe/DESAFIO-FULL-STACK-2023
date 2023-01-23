import React, { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { Formik, Form as FormikForm, FormikHelpers, FormikValues } from 'formik'
import * as yup from 'yup';
import { MyCustomButton, MyFormikInputText } from '../../../common';
import { axiosInstance } from '../../../../api';
import { BadRequestError } from '../../../../errors';
import { IApiErrorResponse } from '../../../../interfaces';
import { checkRutField, cleanAndSplitRutByDv, formatedRut } from '../../../../helpers';
import { FaRegSave } from 'react-icons/fa';

interface Props {
    activeItem?: any;
}

interface FormValues {
    alu_rut_old: string;
    alu_rut_new: string;
    alu_nombres: string;
    alu_apellido_paterno: string;
    alu_apellido_materno: string;
    alu_email: string;
    alu_celular: string;
    anio_ingreso_universidad: string;
    periodo_ingreso_universidad: string;
}

const formDataState = {
    alu_rut_new: '',
    alu_rut_old: '',
    alu_nombres: '',
    alu_apellido_paterno: '',
    alu_apellido_materno: '',
    alu_email: '',
    alu_celular: '',
    anio_ingreso_universidad: '',
    periodo_ingreso_universidad: '',
}

export const FormularioAlumno = (props: Props) => {
    const [formData, setFormData] = React.useState<FormValues>({
        ...formDataState,
    });

    const handleSubmit = async (values: FormikValues, formikHelpers: FormikHelpers<FormValues>) => {
        let errors: IApiErrorResponse[] = [];

        const { rut, dv } = cleanAndSplitRutByDv(values.alu_rut_new);

        try {
            await axiosInstance.post('/alumnos', {
                ...values,
                alu_rut_new: rut,
                alu_dv: dv,
            });

            // Limipar formulario en el crear
            if (!props.activeItem) { // Creando
                setFormData({
                    ...formDataState,
                });
            }

            const wasUpdated = document.getElementById('was-updated') as HTMLInputElement;
            wasUpdated.value = '1';
        } catch (error) {
            if (error instanceof BadRequestError) {
                errors = error.serializeErrors();
            }
        }

        if (errors.length > 0) {
            errors.map(error => {
                if (error?.field) {
                    formikHelpers.setErrors({ [error?.field]: error?.message });
                }
            })
        }
    }

    useEffect(() => {
        if (props.activeItem) {
            setFormData({
                ...props.activeItem,
                alu_rut_new: formatedRut(`${props.activeItem.alu_rut}-${props.activeItem.alu_dv}`),
                alu_rut_old: `${props.activeItem.alu_rut}-${props.activeItem.alu_dv}`,
            });
        }
    }, [props.activeItem])

    return (
        <Formik
            initialValues={formData}
            validate={(values) => {
                let errors: FormikValues = {};

                if (values.alu_rut_new) {
                    const testRut = checkRutField(values.alu_rut_new);
                    if (!testRut) {
                        errors.alu_rut_new = 'El rut no es válido';
                    }
                }

                return errors;
            }}
            enableReinitialize={true}
            onSubmit={handleSubmit}
            validationSchema={yup.object({
                alu_rut_new: yup.string().required('El campo es requerido'),
                alu_nombres: yup.string().required('El campo es requerido'),
                alu_apellido_paterno: yup.string().required('El campo es requerido'),
                alu_apellido_materno: yup.string().required('El campo es requerido'),
                alu_email: yup.string().email('El campo debe ser un email válido').required('El campo es requerido'),
                alu_celular: yup.string().required('El campo es requerido'),
                anio_ingreso_universidad: yup.number().typeError('El campo debe ser numérico').required('El campo es requerido'),
                periodo_ingreso_universidad: yup.number().typeError('El campo debe ser numérico').required('El campo es requerido'),
            })}
        >
            {
                ({ resetForm }) => (
                    <FormikForm>
                        <MyFormikInputText name="alu_rut_new" type="text" placeholder="R.U.T"
                            onChangeInput={(e) => {
                                e.target.value = formatedRut(e.target.value);
                            }}
                        />
                        <MyFormikInputText name="alu_nombres" type="text" placeholder="Nombres" />
                        <MyFormikInputText name="alu_apellido_paterno" type="text" placeholder="Apellido Paterno" />
                        <MyFormikInputText name="alu_apellido_materno" type="text" placeholder="Apellido Materno" />
                        <MyFormikInputText name="alu_email" type="text" placeholder="Email" />
                        <MyFormikInputText name="alu_celular" type="text" placeholder="Celular" maxLength={10} />
                        <MyFormikInputText name="anio_ingreso_universidad" type="text" placeholder="Año Ingreso Universidad" pattern="[0-9]*" maxLength="4" />
                        <MyFormikInputText name="periodo_ingreso_universidad" type="text" placeholder="Periodo Ingreso Universidad" pattern="[0-9]*" maxLength="1" />
                        <MyCustomButton
                            variant="primary"
                            type="submit"
                            className="w-100"
                        >
                            <FaRegSave className="me-2" />Guardar
                        </MyCustomButton>
                    </FormikForm>
                )
            }
        </Formik>
    )
}
