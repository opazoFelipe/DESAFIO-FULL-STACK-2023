import React, { ReactElement } from 'react'
// import ReactModal from 'react-modal';
import Button from 'react-bootstrap/Button';
import BootstrapModal from 'react-bootstrap/Modal';

interface IModalProps {
    children?: ReactElement,
    title: string,
    show: boolean,
    onSuccess?: () => void,
    onClose?: () => void,
    size?: 'sm' | 'lg' | 'xl',
}

export const MyModal = (args: IModalProps) => {
    return (
        <>
            {
                args.show && (
                    <BootstrapModal
                        size={args.size || 'lg'}
                        show={args.show}
                        onHide={args.onClose}
                        backdrop="static"
                        keyboard={false}
                        animation={false}
                    >
                        <BootstrapModal.Header closeButton>
                            <BootstrapModal.Title>{args.title}</BootstrapModal.Title>
                        </BootstrapModal.Header>
                        <BootstrapModal.Body>
                            {args.children}
                        </BootstrapModal.Body>
                        <BootstrapModal.Footer>
                            <Button variant="secondary" onClick={args.onClose}>
                                Cerrar
                            </Button>
                            {
                                args.onSuccess && (
                                    <Button variant="primary" onClick={args.onSuccess}>Guardar</Button>
                                )
                            }

                        </BootstrapModal.Footer>
                    </BootstrapModal>
                )
            }
        </>
    );
}