import React from 'react';
import SolicitudForm from '../components/FormularioSolicitudes/SolicitudForm';
import '../styles/SolicitudPageLayout.css';


export default function SolicitudReparacion() {
    return (
        <div className='p-solicitudesReparacion'>
            <div className='p-solicitudesReparacion titulo'><h2>Solicita tu reparacion</h2> </div>
            <SolicitudForm />
        </div>
    );
}