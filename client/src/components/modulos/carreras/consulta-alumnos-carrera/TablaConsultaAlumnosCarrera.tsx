import React from 'react'
import { Container, Spinner, Table } from 'react-bootstrap'
import { MyCustomButton } from '../../../common';
import { FaEdit, FaTrashAlt, FaUser, FaUserGraduate } from 'react-icons/fa';
import { formatedRut } from '../../../../helpers';
import { onOpenModal } from '../../../../store';

interface Props {
    alumnos: [];
    onOpenModal: (alu_rut: string) => void;
}

export const TablaConsultaAlumnosCarrera = (props: Props) => {
    return (
        <Container fluid>
            {
                <Table className="table-scroll" bordered hover>
                    <thead className="sticky-top bg-primary text-white">
                        <tr>
                            <th>R.U.T</th>
                            <th>Nombres</th>
                            <th>Carrera</th>
                            <th>Programa</th>
                            <th>Ficha Alumno</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.alumnos.length > 0 ?
                                props.alumnos.map((alumno: any, index: number) => {
                                    return (
                                        <tr key={`${alumno.crr_codigo}_${index}`}>
                                            <td width="10%">{formatedRut(`${alumno.alu_rut} - ${alumno.alu_dv}`)}</td>
                                            <td width="30%">{
                                                `${alumno.alu_nombres} ${alumno.alu_apellido_paterno} ${alumno.alu_apellido_materno}`
                                            }</td>
                                            <td width="30%">
                                                {`${alumno.crr_codigo} - ${alumno.crr_nombre}`}
                                            </td>
                                            <td width="15%">{alumno.tprc_nombre}</td>
                                            <td width="10%" className="text-center">
                                                <MyCustomButton
                                                    variant="secondary"
                                                    className="me-2"
                                                    onClick={() => props.onOpenModal(alumno.alu_rut)}
                                                ><FaUser />
                                                </MyCustomButton>
                                            </td>
                                        </tr>
                                    )
                                })
                                : <tr>
                                    <td colSpan={7} className="text-start">
                                        No se encontraron alumnos.
                                    </td>
                                </tr>
                        }
                    </tbody>
                </Table>
            }
        </Container>
    )
}
