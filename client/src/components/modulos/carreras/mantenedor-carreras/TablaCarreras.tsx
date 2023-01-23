import React from 'react'
import { Container, Table } from 'react-bootstrap'
import { MyCustomButton } from '../../../common';
import { FaEdit, FaTrashAlt, FaUserGraduate } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface Props {
    carreras: any;
    handleEdit: (carrera: any) => void;
    handleDelete: (crr_codigo: number) => void;
    onPreNavigateNextPage?: () => void;
}

export const TablaCarreras = (props: Props) => {

    return (
        <Container fluid>
            <Table className="table-scroll" bordered hover>
                <thead className="sticky-top bg-primary text-white">
                    <tr>
                        <th>Código</th>
                        <th>Nombre</th>
                        <th>Escuela</th>
                        <th>Tipo Programa</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {

                        props.carreras.length > 0
                            ? props.carreras.map((carrera: any, index: number) => {
                                return (
                                    <tr key={`${carrera.crr_codigo}_index`}>
                                        <td width="8%">{carrera.crr_codigo}</td>
                                        <td width="25%">{carrera.crr_nombre}</td>
                                        <td width="25%">{carrera.escc_nombre}</td>
                                        <td width="25%">{carrera.tprc_nombre}</td>
                                        <td className="text-center">
                                            <Link
                                                to={`/carreras/alumnos/${carrera.crr_codigo}`}
                                            >
                                                <MyCustomButton
                                                    variant="secondary"
                                                    className="me-2"
                                                    onClick={
                                                        props.onPreNavigateNextPage
                                                            ? props.onPreNavigateNextPage : () => { }
                                                    }
                                                ><FaUserGraduate />
                                                </MyCustomButton>
                                            </Link>
                                            <MyCustomButton
                                                variant="secondary"
                                                onClick={() => props.handleEdit(carrera)}
                                                className="me-2"
                                            ><FaEdit />
                                            </MyCustomButton>

                                            <MyCustomButton
                                                variant="danger"
                                                onClick={() => props.handleDelete(carrera.crr_codigo)}
                                            ><FaTrashAlt />
                                            </MyCustomButton>
                                        </td>
                                    </tr>
                                )
                            })
                            : <tr>

                                <td colSpan={5} className="text-start">
                                    No se encontraron carreras.
                                </td>
                            </tr>

                    }
                </tbody>
            </Table>
        </Container >
    )
}
