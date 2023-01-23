import React, { ReactNode } from 'react'
import { Form } from 'react-bootstrap'

interface Props {
    name: string,
    placeholder?: string
    errorMessage?: string,
    [x: string]: any
    children?: ReactNode
}

export const MySelect = ({children, errorMessage, ...rest }: Props) => {
    return (
        <>
            <Form.Group className="mb-3">
                {/* <Form.Label>Email address</Form.Label> */}
                <Form.Select {...rest} >
                    {children}
                </Form.Select>
               <Form.Control.Feedback type="invalid" className="ms-1">
                    {errorMessage}
                </Form.Control.Feedback>
            </Form.Group>

        </>
    )
}
