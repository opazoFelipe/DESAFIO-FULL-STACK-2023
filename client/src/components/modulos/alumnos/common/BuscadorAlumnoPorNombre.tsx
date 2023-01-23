import React from 'react'
import { MyModal } from '../../../../ui';
import { MyInputText } from '../../../common';
import { FaSearch } from 'react-icons/fa';
import { Button, Form } from 'react-bootstrap';

interface Props {
    name: string,
    onChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void,
    errorMessage?: string,
}

export const BuscadorAlumnoPorNombre = ({ onChangeInput, errorMessage, ...rest }: Props) => {
    const [showModal, setShowModal] = React.useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.validity.valid) {
            e.target.value = e.target.value.slice(0, -1);
            return;
        }

        if (onChangeInput) {
            onChangeInput(e);
        }
    }

    const onCloseModal = () => {
        setShowModal(false)
    }

    return (
        <>
            <Form className="d-flex justify-content-end">
                <Form.Control type="text" placeholder="Buscar..." />
                <Form.Control type="text" placeholder="Filtro..." disabled />
                <Button variant="primary">
                    <FaSearch />
                </Button>
            </Form>

            {/* Next are input text and icon search together inline */}
            {/* <div className="d-flex justify-content-between">
                <Form.Group className="mb-2">
                    <Form.Control
                        type="text"
                        placeholder="R.U.T Alumno sin DV"
                        {...rest}
                        pattern="[0-9]*"
                        onChange={handleChange}
                    />

                    <MyInputText
                        type="text"
                        disabled={true}
                    />
                    <FaSearch onClick={() => setShowModal(true)} />
                    <Form.Control.Feedback type="invalid" className="ms-1">
                        {errorMessage}
                    </Form.Control.Feedback>
                </Form.Group>
            </div>

            <MyModal
                onClose={onCloseModal}
                show={showModal}
                title='Buscar Alumno'
            >
                <h1>Buscador</h1>
            </MyModal> */}

        </>
    )
}
