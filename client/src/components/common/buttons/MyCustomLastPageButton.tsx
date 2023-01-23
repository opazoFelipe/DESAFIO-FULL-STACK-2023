import React from 'react'
import { useNavigate } from 'react-router-dom';
import { MyCustomButton } from './MyCustomButton';
import { AiFillBackward } from 'react-icons/ai';

interface Props {
    [key: string]: any;
}

// Este botón es de uso general para volver a la página anterior
export const MyCustomLastPageButton = (props: Props) => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(-1);
    }

    return (
        <MyCustomButton
            variant='outline-primary'
            onClick={handleClick}
            text="Volver"
            {...props}
        >
            <AiFillBackward className="me-2"/> Volver
        </MyCustomButton>
    )
}
