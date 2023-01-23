import React from 'react'
import { Container, Table } from 'react-bootstrap'
import { MyCustomButton } from '../../../common';
import { FaTrashAlt } from 'react-icons/fa';
import { formatedRut } from '../../../../helpers';

interface Props {
    alumnos: any;
    isLoading: boolean;
    handleDelete: (alu_rut: string) => void;
}

export const TablaAlumnosCarrera = (props: Props) => {
    return (
        <Container fluid>
            {
                <Table className="table-scroll" bordered hover>
                    <thead className="sticky-top bg-primary text-white">
                        <tr>
                            <th>R.U.T</th>
                            <th>Nombres</th>
                            <th>Email</th>
                            <th>Celular</th>
                            <th>Año Ingreso IACC</th>
                            <th>Periodo Ingreso</th>
                            <th></th>
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
                                            <td width="15%">{alumno.alu_email}</td>
                                            <td width="15%">{alumno.alu_celular}</td>
                                            <td width="10%">{alumno.anio_ingreso_universidad}</td>
                                            <td width="10%">{alumno.periodo_ingreso_universidad}</td>
                                            <td className="text-center">
                                                <MyCustomButton
                                                    variant="danger"
                                                    onClick={() => props.handleDelete(alumno.alu_rut)}
                                                ><FaTrashAlt />
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
