import { useEffect, useState } from "react";
import axios from 'axios';
import { Form, Button, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useBackendURL } from '../../../contexts/BackendURLContext.jsx';
import { useParams } from 'react-router-dom';
import AnimatedButton from "../../common/AnimatedButton.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faStethoscope, faCalendarAlt, faDollarSign } from "@fortawesome/free-solid-svg-icons";
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

  if (!solicitud) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="fade-in-animation">
      {solicitud.tipoServicio === "Mantenimiento" ? (
        <div className='row mb-2'>
          <div className="col-12 mb-4">
            <div className="mt-2">
              <h6 className="section-label mb-2">Checklist de Mantenimiento Preventivo</h6>

              <div className="bg-white rounded border" style={{ overflow: 'hidden' }}>
                {solicitud.mantenimiento?.checklist?.map((item) => (

                  <div key={item.id} className="checklist-item">

                    <FontAwesomeIcon icon={faSquare} className="check-icon" />

                    <div className="d-flex flex-column flex-grow-1">
                      <span className="text-dark fw-medium">{item.descripcion}</span>
                    </div>

                    {item.obligatorio && (
                      <span className="badge bg-light text-secondary border ms-2">
                        Obligatorio
                      </span>
                    )}
                  </div>

                ))}
              </div>
            </div>
          </div>
        </div>) : null}
      <div className="info-card p-4">
        <Form className='reviewed-step-form'>
          <div className='row'>
            <div className='col-md-7 mb-4 mb-md-0 border-end-md pe-md-4'>
              <Form.Group controlId='diagnostic'>
                <Form.Label className="section-label mb-2">
                  <FontAwesomeIcon icon={faStethoscope} className="me-2 text-info" />
                  Diagnóstico Técnico
                </Form.Label>
                <Form.Control
                  as='textarea'
                  rows={5}
                  type='text'
                  placeholder='Ingrese el diagnostico'
                  name='diagnosticoTecnico'
                  value={diagnostico}
                  onChange={(e) => { setDiagnostico(e.target.value); handleChange?.(e); }}
                  className="border-0 bg-light p-3"
                  style={{ resize: 'none', borderRadius: '12px' }}
                />
                <Form.Text className="text-muted">
                  Este texto será visible para el cliente en el presupuesto.
                </Form.Text>
              </Form.Group>
            </div>
            <div className='col-md-5 d-flex flex-column justify-content-center ps-md-4'>
              <Form.Group controlId='estimated-date' className="mb-4">
                <Form.Label className="section-label mb-2">
                  <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-primary" />
                  Fecha estimada</Form.Label>
                <Form.Control
                  type='date'
                  name="fechaEstimada"
                  value={fechaEstimada}
                  onChange={(e) => { setFechaEstimada(e.target.value); handleChange?.(e); }}
                  className="form-control-md border-light shadow-sm"
                  style={{ borderRadius: '12px' }}
                />
              </Form.Group>
              <Form.Group controlId='amount' className="mb-4">
                <Form.Label className="section-label mb-2">
                  <FontAwesomeIcon icon={faDollarSign} className="me-2 text-success" />
                  Monto</Form.Label>
                <Form.Control
                  type='number'
                  placeholder='Ingrese el monto'
                  name='monto'
                  value={monto}
                  onChange={(e) => { setMonto(e.target.value); handleChange?.(e); }}
                  className="border-light shadow-sm fw-bold text-dark"
                  style={{ borderRadius: '0 12px 12px 0' }}
                />
              </Form.Group>
            </div>
          </div>
          <div className="buttons-container">
            <AnimatedButton variant='danger' className='button' onClick={cancelStep}>
              Cancelar
            </AnimatedButton>
            <AnimatedButton variant='success' type='submit' className='button' onClick={handleNextStep}>
              Enviar Diagnostico
            </AnimatedButton>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default ReviewedStep;