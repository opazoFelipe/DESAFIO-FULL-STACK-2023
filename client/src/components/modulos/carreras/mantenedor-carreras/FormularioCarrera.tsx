import React, { useEffect } from 'react'
import { Formik, Form as FormikForm, FormikHelpers, FormikValues } from 'formik'
import * as yup from 'yup';
import { MyCustomButton, MyFormikInputText, MyFormikSelect } from '../../../common';
import { axiosInstance } from '../../../../api';
import { BadRequestError } from '../../../../errors';
import { IApiErrorResponse } from '../../../../interfaces';
import { FaRegSave } from 'react-icons/fa';

interface Props {
    activeItem?: any;
    escuelas: any[];
    programas: any[];
    defaultEscuela?: string;
    defaultPrograma?: string;
}

interface FormValues {
    crr_codigo_new: string;
    crr_codigo_old: string;
    escc_codigo: string;
    tprc_codigo: string;
    crr_nombre: string;
}

const formDataState = {
    crr_codigo_new: '',
    crr_codigo_old: '',
    escc_codigo: '',
    tprc_codigo: '',
    crr_nombre: '',
}

export const FormularioCarrera = (props: Props) => {
    const [fomrData, setFormData] = React.useState<FormValues>({
        ...formDataState,
        escc_codigo: props.defaultEscuela || '',
        tprc_codigo: props.defaultPrograma || '',
    });

    const handleSubmit = async (values: FormikValues, formikHelpers: FormikHelpers<FormValues>) => {
        let errors: IApiErrorResponse[] = [];

        try {
            await axiosInstance.post('/carreras', values);

            // Limipar formulario en el crear
            if (!props.activeItem) { // Creando
                setFormData({
                    ...formDataState,
                    escc_codigo: values.escc_codigo,
                    tprc_codigo: values.tprc_codigo,
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
                crr_codigo_new: props.activeItem.crr_codigo,
                crr_codigo_old: props.activeItem.crr_codigo,
            });
        }
    }, [props.activeItem])

    return (
        <Formik
            initialValues={fomrData}
            enableReinitialize={true}
            onSubmit={handleSubmit}
            validationSchema={yup.object({
                escc_codigo: yup.string().required('El campo es requerido'),
                tprc_codigo: yup.string().required('El campo es requerido'),
                crr_codigo_new: yup.number().typeError('El campo debe ser numérico').required('El campo es requerido'),
                crr_nombre: yup.string().required('El campo es requerido'),
            })}
        >
            {
                ({ resetForm }) => (
                    <FormikForm>
                        <MyFormikSelect name="escc_codigo" >
                            <option value="">Seleccione Escuela</option>
                            {
                                props.escuelas.map((escuela: any) => (
                                    <option
                                        key={escuela.escc_codigo}
                                        value={escuela.escc_codigo}
                                    >
                                        {escuela.escc_nombre}
                                    </option>
                                ))
                            }
                        </MyFormikSelect>
                        <MyFormikSelect name="tprc_codigo">
                            <option value="">Seleccione Programa</option>
                            {
                                props.programas.map((programa: any) => (
                                    <option
                                        key={programa.tprc_codigo}
                                        value={programa.tprc_codigo}
                                        {
                                        ...props.defaultPrograma === programa.tprc_codigo
                                            ? { selected: true }
                                            : {}
                                        }
                                    >
                                        {programa.tprc_nombre}
                                    </option>
                                ))
                            }
                        </MyFormikSelect>
                        <MyFormikInputText
                            name="crr_codigo_new"
                            placeholder="Código Carrera"
                            pattern="[0-9]*"
                        />
                        <MyFormikInputText
                            name="crr_nombre"
                            placeholder="Nombre Carrera"
                        />
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
