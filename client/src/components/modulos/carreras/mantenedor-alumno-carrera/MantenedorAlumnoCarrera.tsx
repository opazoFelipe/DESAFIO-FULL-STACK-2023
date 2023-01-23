import React, { useEffect, useState } from 'react'
import { Card, Row, Col } from 'react-bootstrap'
import { MyModal } from '../../../../ui';
import { FormularioAlumnoCarrera } from './FormularioAlumnoCarrera';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { MyCustomButton, MyCustomLastPageButton, MyInputText, MyPagination } from '../../../common';
import { axiosInstance } from '../../../../api';
import { TablaAlumnosCarrera } from './TablaAlumnosCarrera';
import { useParams } from 'react-router-dom';

const registros_por_pagina = 5;

interface ModuloData {
    carrera: {
        [key: string]: any
    },
    alumnos: [],
    alu_rut: string, // hace referencia al rut del alumno seleccionado en el filtro
    total_registros: number,
    fue_cargado: boolean,
}

export const MantenedorAlumnoCarrera = () => {
    const { crr_codigo } = useParams()

    const [modulo, setModulo] = useState<ModuloData>({
        carrera: {},
        alumnos: [],
        alu_rut: '',
        total_registros: 0,
        fue_cargado: false,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const loadModulo = async () => {
        const url = `/mantenedor-carrera-alumno/${crr_codigo}?nro_pagina=1&registros_por_pagina=${registros_por_pagina}`;

        const { data } = await axiosInstance.get(url);

        const total_registros = data ? data.alumnos[0]?.total_registros || 0 : 0;

        setModulo({
            carrera: data.carrera,
            alumnos: data.alumnos,
            alu_rut: '',
            total_registros: total_registros,
            fue_cargado: true,
        });
    };

    const loadAlumnos = async (fromButton = false) => {
        if (fromButton) {
            setCurrentPage(1);
        }

        let url = `/carreras/alumnos/${crr_codigo}`;
        url += `?nro_pagina=${currentPage}&registros_por_pagina=${registros_por_pagina}`;

        if (modulo.alu_rut) {
            url += `&alu_rut=${modulo.alu_rut}`;
        }

        const { data } = await axiosInstance.get(url);

        const total_registros = data.length > 0 ? data[0].total_registros : 0;

        setModulo({
            ...modulo,
            alumnos: data,
            total_registros: total_registros,
        });
    };

    const handleCreate = () => {
        const wasUpdated = document.getElementById('was-updated') as HTMLInputElement;
        wasUpdated.value = '0';

        setShowModal(true);
    }

    const handleDelete = async (alu_rut: string) => {
        const url = `/carreras/alumnos/${crr_codigo}/${alu_rut}`;
        await axiosInstance.delete(url);
        loadAlumnos();
    };

    const onCloseModal = () => {
        const wasUpdated = document.getElementById('was-updated') as HTMLInputElement;

        setShowModal(false);

        if (wasUpdated.value === '1') {
            loadAlumnos();
        }
    }

    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.validity.valid) {
            e.target.value = e.target.value.slice(0, -1);
            return;
        }

        setModulo({
            ...modulo,
            [e.target.name]: e.target.value,
        })
    }

    const handlePageClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    }

    useEffect(() => {
        loadModulo();
    }, []);

    useEffect(() => {
        if (modulo.fue_cargado) {
            loadAlumnos();
        }
    }, [currentPage]);

    return (
        <>
            <div className="d-flex justify-content-between pt-3">
                <h3 className="card-title text-center fw-light fs-2 text-primary">Mantenedor Alumnos Carrera</h3>
                {/* Here align this two buttons together to end */}
                <div className="d-flex justify-content-end">
                    <MyCustomButton
                        style={{
                            height: '2.813rem',
                        }}
                        className="me-2"
                        variant="primary"
                        onClick={handleCreate}
                    >
                        <FaPlus className="me-2" />  Agregar Alumno
                    </MyCustomButton>
                    <MyCustomLastPageButton
                        style={{
                            height: '2.813rem',
                        }}
                    />
                </div>
            </div>
            <hr />
            <div className="ficha-datos px-5 my-5">
                <Row>
                    <Col md={6}>
                        <Row>
                            <Col md={4}>
                                <label className="form-label">Código Carrera: </label>
                            </Col>
                            <Col md={8}>
                                <p>{modulo.carrera.crr_codigo}</p>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={6}>
                        <Row>
                            <Col md={4}>
                                <label className="form-label">Nombre Carrera: </label>
                            </Col>
                            <Col md={8}>
                                <p>{modulo.carrera.crr_nombre}</p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Row>
                            <Col md={4}>
                                <label className="form-label">Escuela Carrera: </label>
                            </Col>
                            <Col md={8}>
                                <p>{modulo.carrera.escc_nombre}</p>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={6}>
                        <Row>
                            <Col md={4}>
                                <label className="form-label">Programa Carrera: </label>
                            </Col>
                            <Col md={8}>
                                <p>{modulo.carrera.tprc_nombre}</p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>

            <hr />
            <Card
                style={{ width: '30rem' }}
                className="mx-auto mt-4"
                border="light"
            >
                <MyInputText
                    type="text"
                    name="alu_rut"
                    placeholder="R.U.T Alumno sin DV"
                    pattern="[0-9]*"
                    onChange={onChangeInput}
                    maxLength={10}
                />

                <MyCustomButton
                    style={{ width: '35%' }}
                    className="mx-auto mt-2"
                    variant="primary" onClick={() => loadAlumnos(true)}>
                    <FaSearch className="me-2" /> Buscar
                </MyCustomButton>
            </Card>
            <br />
            <div className="d-flex justify-content-center mt-3">
                <MyPagination
                    totalItems={modulo.total_registros}
                    itemsPerPage={registros_por_pagina}
                    currentPage={currentPage}
                    setCurrentPage={handlePageClick}
                />
            </div>
            <h4 className="fw-light text-primary">Alumnos</h4>
            <hr />
            <TablaAlumnosCarrera
                isLoading={isLoading}
                alumnos={modulo.alumnos}
                handleDelete={handleDelete}
            />
            <MyModal
                onClose={onCloseModal}
                show={showModal}
                title='Agregar Alumno'
            >
                <FormularioAlumnoCarrera
                    crr_codigo={crr_codigo || ''}
                />
            </MyModal>
            <input type="hidden" id="was-updated" value="0" />
        </>
    )
}