import { useEffect, useState } from "react";
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useBackendURL } from '../../../contexts/BackendURLContext.jsx';
import { useParams } from 'react-router-dom';
import "./reviewedStep.css"

function ReviewedStep({ solicitud, nextStep, cancelStep, handleChange }) {
  const { id: solicitudId } = useParams();
  const backendURL = useBackendURL();
  const navigate = useNavigate();
  const [fechaFormateada, setFechaFormateada] = useState('');
  const [idCategoria, setIdCategoria] = useState(null);
  const [diagnostico, setDiagnostico] = useState('');
  const [fechaEstimada, setFechaEstimada] = useState('');
  const [monto, setMonto] = useState('');

  useEffect(() => {
    setDiagnostico(solicitud?.diagnosticoTecnico ?? solicitud?.diagnostico_tecnico ?? '');
    setFechaEstimada(solicitud?.fechaEstimada ?? solicitud?.fecha_estimada ?? '');
    setMonto(solicitud?.monto ?? '');
  }, [solicitud]);

  const handleNextStep = (event) => {
    event.preventDefault();
    nextStep({ diagnosticoTecnico: diagnostico, fechaEstimada: fechaEstimada, monto: monto });
  };
  const adjustTextareaHeight = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  if (!solicitud) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <Form className='data-container'>
        <div className='row'>
          <div className='col-12'>
            {solicitud.tipoServicio === "Reparación" ? (
              <div className="col-12">
                <Form.Group controlId="description">
                  <Form.Label className="fw-bold">Descripcion del problema</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    type="text"
                    value={solicitud.descripcion}
                    readOnly
                    style={{ resize: "vertical" }}
                  />
                </Form.Group>
              </div>
            ) : <div className="col-12">
              <Form.Group controlId="description">
                <Form.Label className="mb-2 mt-2 fw-bold">Descripcion del mantenimiento</Form.Label>
                <Form.Control
                  as="textarea"
                  type="text"
                  value={solicitud.mantenimiento?.descripcion}
                  readOnly
                  style={{ resize: 'none', overflow: 'hidden' }}
                  onInput={adjustTextareaHeight}
                />
              </Form.Group>
            </div>}
          </div>
        </div>
        <div className="my-4"></div>
      </Form>
      <Form className='reviewed-step-form'>
        <div className='row'>
          <div className='col-diagnostic'>
            <Form.Group controlId='diagnostic'>
              <Form.Label className="fw-bold">Diagnostico</Form.Label>
              <Form.Control
                as='textarea'
                rows={5}
                type='text'
                placeholder='Ingrese el diagnostico'
                name='diagnosticoTecnico'
                value={diagnostico}
                onChange={(e) => { setDiagnostico(e.target.value); handleChange?.(e); }}
              />
            </Form.Group>
          </div>
          <div className='col-amount'>
            <Form.Group controlId='estimated-date'>
              <Form.Label className="fw-bold">Fecha estimada</Form.Label>
              <Form.Control
                type='date'
                name="fechaEstimada"
                value={fechaEstimada}
                onChange={(e) => { setFechaEstimada(e.target.value); handleChange?.(e); }}
              />
            </Form.Group>
            <Form.Group className='amount-form-label' controlId='amount'>
              <Form.Label className="fw-bold">Monto</Form.Label>
              <Form.Control
                type='number'
                placeholder='Ingrese el monto'
                name='monto'
                value={monto}
                onChange={(e) => { setMonto(e.target.value); handleChange?.(e); }}
              />
            </Form.Group>
          </div>
        </div>
        <div className='button-group'>
          <Button variant='danger' className='button' onClick={cancelStep}>
            Cancelar
          </Button>
          <Button variant='success' type='submit' className='button' onClick={handleNextStep}>
            Enviar Diagnostico
          </Button>
        </div>
      </Form>
    </>
  );
}

export default ReviewedStep;