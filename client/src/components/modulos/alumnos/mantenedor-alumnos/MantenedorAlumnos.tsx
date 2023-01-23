import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import { MyModal } from '../../../../ui';
import { FormularioAlumno } from './FormularioAlumno';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { MyCustomButton, MyInputText, MyPagination } from '../../../common';
import { axiosInstance } from '../../../../api';
import { TablaAlumnos } from './TablaAlumnos';

const registros_por_pagina = 5;

interface ModuloData {
    alumnos: [],
    alu_rut: string, // hace referencia al rut seleccionado en el filtro
    total_registros: number,
    fue_cargado: boolean,
}

export const MantenedorAlumnos = () => {
    console.log('mantenedor');
    const [modulo, setModulo] = useState<ModuloData>({
        alumnos: [],
        alu_rut: '',
        total_registros: 0,
        fue_cargado: false,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [alumnoSelected, setAlumnoSelected] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const loadModulo = async () => {
        let total_registros = 0;

        let url = '/mantenedor-alumnos';
        url += `?nro_pagina=${currentPage}&registros_por_pagina=${registros_por_pagina}`;

        const { data } = await axiosInstance.get(url);

        if (data.alumnos && data.alumnos.length > 0) {
            total_registros = data.alumnos[0].total_registros || 0;
        }

        setModulo({
            alumnos: data.alumnos,
            alu_rut: '',
            total_registros,
            fue_cargado: true,
        });
    };

    const loadAlumnos = async (fromButton = false) => {
        if (fromButton) {
            setCurrentPage(1);
        }

        let total_registros = 0;
        let url = '/alumnos';
        url += `?nro_pagina=${currentPage}&registros_por_pagina=${registros_por_pagina}`;

        if (modulo.alu_rut) {
            url += `&alu_rut=${modulo.alu_rut}`;
        }

        const { data } = await axiosInstance.get(url);
        if (data && data.length > 0) {
            total_registros = data[0].total_registros || 0;
        }

        setModulo({
            ...modulo,
            alumnos: data,
            total_registros: total_registros
        });
    };

    const handleCreate = () => {
        const wasUpdated = document.getElementById('was-updated') as HTMLInputElement;
        wasUpdated.value = '0';

        setAlumnoSelected(null);
        setShowModal(true);
    }

    const handleEdit = (alumno: any) => {
        const wasUpdated = document.getElementById('was-updated') as HTMLInputElement;
        wasUpdated.value = '0';

        setAlumnoSelected(alumno);
        setShowModal(true);
    }

    const handleDelete = async (alu_rut: string) => {
        await axiosInstance.delete(`/alumnos/${alu_rut}`);
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
            <div className="d-flex justify-content-between mt-3">
                <h3 className="card-title text-center fw-light fs-2 text-primary">Mantenedor Alumnos</h3>
                <MyCustomButton
                    style={{ height: '45px' }}
                    variant="primary"
                    onClick={handleCreate}
                >
                    <FaPlus className="me-2" />  Agregar Alumno
                </MyCustomButton>
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
            <TablaAlumnos
                isLoading={isLoading}
                alumnos={modulo.alumnos}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
            <MyModal
                onClose={onCloseModal}
                show={showModal}
                title={alumnoSelected ? 'Editar Alumno' : 'Agregar Alumno'}
            >
                <FormularioAlumno
                    activeItem={alumnoSelected}
                />
            </MyModal>
            <input type="hidden" id="was-updated" value="0" />
        </>
    )
}