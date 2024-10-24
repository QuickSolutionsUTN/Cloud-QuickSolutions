import React, { useState } from 'react';
import { ProgressBar, Button } from 'react-bootstrap';
import PasoFormulario from './PasoSolicitud.jsx';
import './SolicitudForm.css';

const pasos = [
    { id: 1, nombre: 'Datos del Producto' },
    { id: 2, nombre: 'Envío' },
    { id: 3, nombre: 'Hecho' },
];

export default function Formulario() {
    const [pasoActual, setPasoActual] = useState(0);
    const avanzarPaso = () => {
        setPasoActual((prevPaso) => Math.min(prevPaso + 1, pasos.length - 1));
    };

    const retrocederPaso = () => {
        setPasoActual((prevPaso) => Math.max(prevPaso - 1, 0));
    };
    //<ProgressBar now={(pasoActual + 1) * (100 / pasos.length)} label={`${(pasoActual + 1) * (100 / pasos.length)}%`} />
    return (
        <div className="container mt-4">
            <div className="steps-tittle-container">
                <div className={`step ${pasoActual >= 0 ? 'active' : 'inactive'}`}> <b>1. {pasos[0].nombre}</b></div>
                <div className={`step ${pasoActual >= 1 ? 'active' : 'inactive'}`}> <b>2. {pasos[1].nombre}</b></div>
                <div className={`step ${pasoActual >= 2 ? 'active' : 'inactive'}`}> <b>3. {pasos[2].nombre}</b></div>
            </div>
            <ProgressBar now={(pasoActual + 1) * (100 / pasos.length)} className='.custom-progress '/>
            <div className="mt-4">
                {/* Renderizar el componente PasoFormulario */}
                <PasoFormulario paso={pasos[pasoActual]} />
            </div>
            <div className="mt-4">
                <Button 
                    variant="secondary" 
                    onClick={retrocederPaso} 
                    disabled={pasoActual === 0}
                >
                    Anterior
                </Button>
                <Button 
                    variant="primary" 
                    onClick={avanzarPaso}
                    disabled={pasoActual === pasos.length - 1}
                >
                    {pasoActual === pasos.length - 1 ? 'Finalizar' : 'Siguiente'}
                </Button>
            </div>
        </div>
    );
}