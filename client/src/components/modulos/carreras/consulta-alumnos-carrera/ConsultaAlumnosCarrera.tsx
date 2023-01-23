import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import { MyModal } from '../../../../ui';
import { FaSearch } from 'react-icons/fa';
import { MyCustomButton, MyInputText, MyPagination, MySelect } from '../../../common';
import { axiosInstance } from '../../../../api';
import { TablaConsultaAlumnosCarrera } from './TablaConsultaAlumnosCarrera';
import { FichaAlumno } from '../../alumnos/common';

const registros_por_pagina = 5;

interface ModuloData {
    escuelas: [],
    programas: [],
    alumnos: [],
    escc_codigo: string, // hace referencia a la escuela seleccionada en el filtro
    tprc_codigo: string, // hace referencia al programa seleccionado en el filtro
    crr_codigo: string, // hace referencia al codigo de la carrera seleccionada en el filtro
    crr_nombre: string, // hace referencia al nombre de la carrera seleccionada en el filtro
    alu_rut: string, // hace referencia al rut seleccionado en el filtro
    total_registros: number,
    fue_cargado: boolean,
}

export const ConsultaAlumnosCarrera = () => {
    const [modulo, setModulo] = useState<ModuloData>({
        escuelas: [],
        programas: [],
        alumnos: [],
        escc_codigo: '',
        tprc_codigo: '',
        crr_codigo: '',
        crr_nombre: '',
        alu_rut: '',
        total_registros: 0,
        fue_cargado: false,
    });

    const [aluRutActive, setAluRutActive] = useState<string>('');
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const loadModulo = async () => {
        if (modulo.fue_cargado) return;

        const url = `/consulta-carrera-alumno?nro_pagina=1&registros_por_pagina=${registros_por_pagina}`;

        const { data } = await axiosInstance.get(url);
        const total_registros = data ? data.alumnos[0].total_registros || 0 : 0;

        setModulo({
            ...modulo, // Parten vacios los filtros
            escuelas: data.escuelas,
            programas: data.programas,
            alumnos: data.alumnos,
            total_registros: total_registros,
            fue_cargado: true,
        });
    };

    const loadAlumnos = async (fromButton = false) => {
        if (fromButton) {
            setCurrentPage(1);
        }

        let url = '/carreras/alumnos';
        url += `?nro_pagina=${currentPage}&registros_por_pagina=${registros_por_pagina}`;

        const { escc_codigo, tprc_codigo, crr_codigo, crr_nombre, alu_rut } = modulo;

        if (escc_codigo || tprc_codigo || crr_codigo || crr_nombre || alu_rut) {
            if (escc_codigo) {
                url += `&escc_codigo=${escc_codigo}`;
            }
            if (tprc_codigo) {
                url += `&tprc_codigo=${tprc_codigo}`;
            }
            if (crr_codigo) {
                url += `&crr_codigo=${crr_codigo}`;
            }
            if (crr_nombre) {
                url += `&crr_nombre=${crr_nombre}`;
            }
            if (alu_rut) {
                url += `&alu_rut=${alu_rut}`;
            }
        }

        const { data } = await axiosInstance.get(url);
        const total_registros = data.length > 0 ? data[0].total_registros : 0;

        setModulo({
            ...modulo,
            alumnos: data,
            total_registros: total_registros
        });
    };

    const onOpenModal = (alu_rut: string) => {
        setAluRutActive(alu_rut);
        setShowModal(true);
    }

    const onCloseModal = () => {
        const wasUpdated = document.getElementById('was-updated') as HTMLInputElement;
        setShowModal(false);
    }

    const onChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setModulo({
            ...modulo,
            [e.target.name]: e.target.value,
        });
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
            <div className="d-flex justify-content-between mt-3">
                <h3 className="card-title text-center fw-light fs-2 text-primary">Consulta Alumnos Carrera</h3>
            </div>
            <hr />
            <Card
                style={{ width: '30rem' }}
                className="mx-auto mt-4"
                border="light"
            >
                <MySelect
                    name="escc_codigo"
                    onChange={onChangeSelect}
                    defaultValue={modulo.escc_codigo}
                >
                    <option value="">Seleccione una escuela</option>
                    {
                        modulo.escuelas.map((escuela: any) => (
                            <option key={escuela.escc_codigo}
                                value={escuela.escc_codigo}
                            >{escuela.escc_nombre}</option>
                        ))
                    }
                </MySelect>

                <MySelect
                    name="tprc_codigo"
                    onChange={onChangeSelect}
                    defaultValue={modulo.tprc_codigo}
                >
                    <option value="">Seleccione un programa</option>
                    {
                        modulo.programas.map((programa: any) => (
                            <option key={programa.tprc_codigo}
                                value={programa.tprc_codigo}
                            >{programa.tprc_nombre}</option>
                        ))
                    }
                </MySelect>
                <MyInputText
                    type="text"
                    pattern="[0-9]*"
                    name="crr_codigo"
                    placeholder="Código Carrera"
                    onChange={onChangeInput}
                    value={modulo.crr_codigo}
                />
                <MyInputText
                    type="text"
                    name="crr_nombre"
                    placeholder="Nombre Carrera"
                    onChange={onChangeInput}
                    value={modulo.crr_nombre}
                />
                <MyInputText
                    type="text"
                    name="alu_rut"
                    placeholder="R.U.T Alumno sin DV"
                    pattern="[0-9]*"
                    onChange={onChangeInput}
                    maxLength={10}
                />
                {/* TODO: Ver si alcanza el tiempo para hacer el buscador por nombre de alumno */}
                {/* <BuscadorAlumnoPorNombre
                    name="alu_rut"
                    onChangeInput={onChangeInput}
                /> */}
                <MyCustomButton
                    style={{ width: '35%' }}
                    className="mx-auto mt-2"
                    variant="primary" onClick={() => loadAlumnos()}>
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
            <TablaConsultaAlumnosCarrera
                alumnos={modulo.alumnos}
                onOpenModal={onOpenModal}
            />
            <MyModal
                onClose={onCloseModal}
                show={showModal}
                title='Ficha Alumno'
                size='lg'
            >
                <FichaAlumno alu_rut={aluRutActive} />
            </MyModal>
        </>
    )
}