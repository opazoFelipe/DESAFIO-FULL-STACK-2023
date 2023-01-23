import React from 'react'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface Props {
    variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link' | 'outline-primary' | 'outline-secondary' | 'outline-success' | 'outline-danger' | 'outline-warning' | 'outline-info' | 'outline-light' | 'outline-dark';
    onClick?: () => void;
    children?: React.ReactNode;
    [x: string]: any;
}

export const MyCustomButton = ({ children, ...rest }: Props) => {
    const renderTooltip = () => (
        <Tooltip id="button-tooltip"
            placement="top-start"
        >
            Simple tooltip
        </Tooltip>
    );

    return (
        <Button
            {...rest}
        >
            <div className="d-flex justify-content-center align-items-center">
                {children}
            </div>
        </Button>
    )
}

// tengo un componente reutilizable en react el cuál es un botón, como prodria crear un objeto con las propiedades que me recomendaste y pasarle estos estilos al botón todo dentro del archivo de este componente?