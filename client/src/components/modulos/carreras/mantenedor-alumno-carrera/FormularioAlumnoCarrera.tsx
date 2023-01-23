import React from 'react'
import { Formik, Form as FormikForm, FormikHelpers, FormikValues } from 'formik'
import * as yup from 'yup';
import { MyCustomButton, MyFormikInputText } from '../../../common';
import { axiosInstance } from '../../../../api';
import { BadRequestError } from '../../../../errors';
import { IApiErrorResponse } from '../../../../interfaces';
import { checkRutField, cleanAndSplitRutByDv, formatedRut } from '../../../../helpers';
import { FaRegSave } from 'react-icons/fa';

interface Props {
    crr_codigo: string;
}

interface FormValues {
    crr_codigo: string;
    alu_rut: string;
}

const formDataState = {
    crr_codigo: '',
    alu_rut: '',
}

export const FormularioAlumnoCarrera = (props: Props) => {
    const [formData, setFormData] = React.useState<FormValues>({
        ...formDataState,
        crr_codigo: props.crr_codigo,
    });

    const handleSubmit = async (values: FormikValues, formikHelpers: FormikHelpers<FormValues>) => {
        let errors: IApiErrorResponse[] = [];

        const { rut } = cleanAndSplitRutByDv(values.alu_rut);

        try {
            await axiosInstance.post('/carreras/alumnos', {
                crr_codigo: props.crr_codigo,
                alu_rut: rut,
            });

            // Limipar formulario en el crear
            setFormData({
                crr_codigo: props.crr_codigo,
                alu_rut: '',
            });

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

    return (
        <Formik
            initialValues={formData}
            validate={(values) => {
                let errors: FormikValues = {};

                if (values.alu_rut) {
                    const testRut = checkRutField(values.alu_rut);
                    if (!testRut) {
                        errors.alu_rut = 'El rut no es válido';
                    }
                }

                return errors;
            }}
            enableReinitialize={true}
            onSubmit={handleSubmit}
            validationSchema={yup.object({
                crr_codigo: yup.string().required('El campo es requerido'),
                alu_rut: yup.string().required('El campo es requerido'),
            })}
        >
            {
                ({ resetForm }) => (
                    <FormikForm>
                        <MyFormikInputText name="crr_codigo" type="text" disabled />
                        <MyFormikInputText name="alu_rut" type="text" placeholder="R.U.T"
                            onChangeInput={(e) => {
                                e.target.value = formatedRut(e.target.value);
                            }}
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
