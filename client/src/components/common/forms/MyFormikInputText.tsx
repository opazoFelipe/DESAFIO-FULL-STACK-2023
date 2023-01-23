import React from 'react'
import { useField, ErrorMessage } from 'formik';
import { Form } from 'react-bootstrap';

interface IMyTextInputProps {
    name: string,
    type?: 'text' | 'email' | 'password' | 'number',
    placeholder?: string
    [x: string]: any,
    onChangeInput?: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

export const MyFormikInputText = (props: IMyTextInputProps) => {

    // field => { name, value, onChange, onBlur }
    const [field, meta, { setValue, setError }] = useField(props);
    const { onChangeInput, ...rest } = props;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (props.pattern) {
            if (!e.target.validity.valid) {
                e.target.value = e.target.value.slice(0, -1);
            }
        }

        if (props.onChangeInput) {
            props.onChangeInput(e);
        }

        field.onChange(e);
    }

    return (
        <>
            <Form.Group className="mb-3">
                <Form.Control
                    {...rest}
                    {...field}
                    onChange={handleChange}
                    isInvalid={meta.touched && meta.error ? true : false}
                />
                <Form.Control.Feedback type="invalid" className="ms-1">
                    <ErrorMessage name={field.name} />
                </Form.Control.Feedback>
            </Form.Group>
        </>
    )
}
