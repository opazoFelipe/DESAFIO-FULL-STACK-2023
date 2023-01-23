import React from 'react'
import { Form } from 'react-bootstrap'

interface Props {
    name?: string,
    type?: 'text' | 'email' | 'password' | 'number',
    placeholder?: string
    errorMessage?: string,
    [x: string]: any
}

export const MyInputText = ({ errorMessage, ...rest }: Props) => {
    return (
        <>
            <Form.Group className="mb-2">
                {/* <Form.Label>Email address</Form.Label> */}
                <Form.Control
                    {...rest}
                />
               <Form.Control.Feedback type="invalid" className="ms-1">
                    {errorMessage}
                </Form.Control.Feedback>
            </Form.Group>

        </>
    )
}
