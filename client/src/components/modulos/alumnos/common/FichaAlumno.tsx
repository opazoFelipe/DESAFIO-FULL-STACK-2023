import React, { useEffect, useState } from 'react'

import { axiosInstance } from '../../../../api';
import { formatedRut } from '../../../../helpers';

interface Props {
    alu_rut: string,
}

export const FichaAlumno = (props: Props) => {

    const [alumno, setAlumno] = useState<any>({});

    const loadAlumno = async () => {
        if (!props.alu_rut) return;

        const { data } = await axiosInstance.get(`/alumnos?alu_rut=${props.alu_rut}`);
        const rutSinFormato = `${data[0].alu_rut}-${data[0].alu_dv}`;

        setAlumno({
            ...data[0],
            rutConFormato: formatedRut(rutSinFormato),
        });
    }

    useEffect(() => {
        loadAlumno();
    }, []);

    if (!alumno.alu_rut) return (<>
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    </>);

    return (
        <>
            <div className="row">
                <div className="col-6">
                    <div className="row">
                        <div className="col-4"><b>R.U.T: </b></div>
                        <div className="col-8">{alumno.rutConFormato}</div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="row">
                        <div className="col-4"><b>Nombre: </b></div>
                        <div className="col-8">{`${alumno.alu_nombres} ${alumno.alu_apellido_paterno} ${alumno.alu_apellido_materno}`}</div>
                    </div>
                </div>
            </div>
            <br />
            <div className="row">
                <div className="col-6">
                    <div className="row">
                        <div className="col-4"><b>Email: </b></div>
                        <div className="col-8">{alumno.alu_email}</div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="row">
                        <div className="col-4"><b>Celular: </b></div>
                        <div className="col-8">+569 {alumno.alu_celular}</div>
                    </div>
                </div>
            </div>
            <br />
            <div className="row">
                <div className="col-6">
                    <div className="row">
                        <div className="col-4"><b>Año Ingreso IACC: </b></div>
                        <div className="col-8">{alumno.anio_ingreso_universidad}</div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="row">
                        <div className="col-4"><b>Periodo Ingreso IACC: </b></div>
                        <div className="col-8">{alumno.periodo_ingreso_universidad}</div>
                    </div>
                </div>
            </div>
        </>

    )
}
