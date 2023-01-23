import React from 'react'
import { useField, ErrorMessage } from 'formik';
import { Form } from 'react-bootstrap';

interface Props {
    name: string;
    placeholder?: string;
    [x: string]: any;
    onChange?: (e: any) => void;
}

export const MyFormikSelect = ({ ...props }: Props) => {

    const [field] = useField(props)

    return (
        <>
            <Form.Group className="mb-2">
                <Form.Control as="select" {...field} {...props} />
                <Form.Control.Feedback type="invalid" className="ms-1">
                    <ErrorMessage name={field.name} />
                </Form.Control.Feedback>
            </Form.Group>
        </>
    )
}