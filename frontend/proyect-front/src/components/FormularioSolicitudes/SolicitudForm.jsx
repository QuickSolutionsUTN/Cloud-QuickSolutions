import React, { useState } from 'react';
import { ProgressBar, Button } from 'react-bootstrap';
import PasoFormulario from './PasoSolicitud.jsx';


import './SolicitudForm.css';

const pasos = [
  { id: 1, nombre: 'Datos del Producto', seccion: 'datosProducto' },
  { id: 2, nombre: 'Datos Personales', seccion: 'datosPersonales' },
  { id: 3, nombre: 'Hecho', seccion: 'confirmacion' },
];

export const Formulario = () => {
  const [pasoActual, setPasoActual] = useState(0);

  const [formData, setFormData] = useState({
    datosProducto: { idcategoria: '', idtipoproducto: '', descripcionProblema: '' },
    datosPersonales: {email: '', nombre: '', apellido: ''},
  });

  // Función para actualizar los datos de cada paso
  const actualizarDatos = (seccion, nuevosDatos) => {
    setFormData((prevData) => ({
      ...prevData,
      [seccion]: { ...prevData[seccion], ...nuevosDatos }
    }));
  };

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
      <ProgressBar now={(pasoActual + 1) * (100 / pasos.length)} className='.custom-progress ' />
      <div className="mt-4">
        <PasoFormulario
          paso={pasos[pasoActual]}
          formData={formData[pasos[pasoActual].seccion]}
          actualizarDatos={nuevosDatos =>
            setFormData(prevData => ({
              ...prevData,
              [pasos[pasoActual].seccion]: {
                ...prevData[pasos[pasoActual].seccion],
                ...nuevosDatos,
              },
            }))
          }
        />
      </div>
      <div className="mt-4 container-buttons">
        <Button
          variant="secondary"
          onClick={retrocederPaso}
          disabled={pasoActual === 0}
        >
          Anterior
        </Button>
        <Button
          className='next-button'
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

export default Formulario;