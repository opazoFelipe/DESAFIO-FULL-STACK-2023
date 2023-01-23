import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import { MyModal } from '../../../../ui';
import { FormularioCarrera } from './FormularioCarrera';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { MyCustomButton, MyInputText, MyPagination, MySelect } from '../../../common';
import { axiosInstance } from '../../../../api';
import { TablaCarreras } from './TablaCarreras';
import { useUsuarioStore } from '../../../../hooks';

const registros_por_pagina = 5;

interface ModuloData {
    escuelas: [],
    programas: [],
    carreras: [],
    escc_codigo: string, // hace referencia a la escuela seleccionada en el filtro
    tprc_codigo: string, // hace referencia al programa seleccionado en el filtro
    crr_codigo: string, // hace referencia al codigo de la carrera seleccionada en el filtro
    crr_nombre: string, // hace referencia al nombre de la carrera seleccionada en el filtro
    total_registros: number,
    fue_cargado: boolean,
}

export const MantenedorCarreras = () => {
    const {
        backButtonLastData,
        onStartingClearBackButtonLastData,
        onStartingSetBackButtonLastData
    } = useUsuarioStore();

    const [modulo, setModulo] = useState<ModuloData>({
        escuelas: backButtonLastData?.complexData?.escuelas || [],
        programas: backButtonLastData?.complexData?.programas || [],
        carreras: backButtonLastData?.complexData?.carreras || [],
        escc_codigo: backButtonLastData?.simpleFiltros?.escc_codigo || '',
        tprc_codigo: backButtonLastData?.simpleFiltros?.tprc_codigo || '',
        crr_codigo: backButtonLastData?.simpleFiltros?.crr_codigo || '',
        crr_nombre: backButtonLastData?.simpleFiltros?.crr_nombre || '',
        total_registros: backButtonLastData?.complexData?.total_registros || 0,
        fue_cargado: backButtonLastData?.complexData?.fue_cargado || false,
    });

    const [carreraSelected, setCarreraSelected] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(
        parseInt(backButtonLastData?.simpleFiltros?.currentPage || '1')
    );

    const loadModulo = async () => {
        if (backButtonLastData?.complexData?.fue_cargado) {
            onStartingClearBackButtonLastData();
            return;
        }

        const { data } = await axiosInstance.get('/mantenedor-carreras?&nro_pagina=1&registros_por_pagina=5');
        const total_registros = data.carreras.length > 0 ? data.carreras[0].total_registros : 0;

        setModulo({
            ...modulo, // Parten vacios los filtros
            escuelas: data.escuelas,
            programas: data.programas,
            carreras: data.carreras,
            total_registros: total_registros,
            fue_cargado: true,
        });
    };

    const loadCarreras = async (fromButton = false) => {
        if (fromButton) {
            setCurrentPage(1);
        }

        let url = '/carreras';
        const { escc_codigo, tprc_codigo, crr_codigo, crr_nombre } = modulo;

        url += `?nro_pagina=${currentPage}&registros_por_pagina=${registros_por_pagina}`;

        if (escc_codigo || tprc_codigo || crr_codigo || crr_nombre) {
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
        }

        const { data } = await axiosInstance.get(url);
        
        const total_registros = data ? data[0].total_registros : 0;

        setModulo({
            ...modulo,
            carreras: data,
            total_registros: total_registros,
        });
    };

    const handleCreate = () => {
        const wasUpdated = document.getElementById('was-updated') as HTMLInputElement;
        wasUpdated.value = '0';

        setCarreraSelected(null);
        setShowModal(true);
    }

    const handleEdit = (carrera: any) => {
        const wasUpdated = document.getElementById('was-updated') as HTMLInputElement;
        wasUpdated.value = '0';

        setCarreraSelected(carrera);
        setShowModal(true);
    }

    const handleDelete = async (crr_codigo: number) => {
        await axiosInstance.delete(`/carreras/${crr_codigo}`);
        loadCarreras();
    };

    const onCloseModal = () => {
        const wasUpdated = document.getElementById('was-updated') as HTMLInputElement;

        setShowModal(false);

        if (wasUpdated.value === '1') {
            loadCarreras();
        }
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

    const saveCurrentData = () => {
        onStartingSetBackButtonLastData({
            simpleFiltros: {
                escc_codigo: modulo.escc_codigo,
                tprc_codigo: modulo.tprc_codigo,
                crr_codigo: modulo.crr_codigo,
                crr_nombre: modulo.crr_nombre,
                currentPage: currentPage.toString(),
            },
            complexData: {
                escuelas: modulo.escuelas,
                programas: modulo.programas,
                carreras: modulo.carreras,
                total_registros: modulo.total_registros,
                fue_cargado: true,
            }
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
            loadCarreras();
        }
    }, [currentPage]);

    return (
        <>
            <div className="d-flex justify-content-between mt-3">
                <h3 className="card-title text-center fw-light fs-2 text-primary">Mantenedor Carreras</h3>

                <MyCustomButton
                    style={{ height: '45px' }}
                    variant="primary"
                    onClick={handleCreate}
                >
                    <FaPlus className="me-2" />Agregar Carrera
                </MyCustomButton>
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
                <MyCustomButton
                    style={{ width: '35%' }}
                    className="mx-auto mt-2"
                    variant="primary" onClick={() => loadCarreras(true)}>
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
            <h4 className="fw-light text-primary">Carreras</h4>
            <hr />
            <TablaCarreras
                carreras={modulo.carreras}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                onPreNavigateNextPage={saveCurrentData}
            />
            <MyModal
                onClose={onCloseModal}
                show={showModal}
                title={carreraSelected ? 'Editar Carrera' : 'Agregar Carrera'}
            >
                <FormularioCarrera
                    escuelas={modulo.escuelas}
                    programas={modulo.programas}
                    activeItem={carreraSelected}
                    defaultEscuela={modulo.escc_codigo}
                    defaultPrograma={modulo.tprc_codigo}
                />
            </MyModal>
            <input type="hidden" id="was-updated" value="0" />
        </>
    )
}