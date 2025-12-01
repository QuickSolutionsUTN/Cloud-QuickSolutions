import { useEffect, useState } from "react";
import axios from 'axios';
import { Form, Button, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useBackendURL } from '../../../contexts/BackendURLContext.jsx';
import { useParams } from 'react-router-dom';
import AnimatedButton from "../../common/AnimatedButton.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare } from "@fortawesome/free-solid-svg-icons";
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
      <Form className='reviewed-step-container'>
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
              <div className="col-12 mb-3">
                <div className="section-label mb-2">Descripción del mantenimiento</div>

                <div className="description-card">
                  {solicitud.mantenimiento?.descripcion || "Sin descripción proporcionada."}
                </div>
              </div>
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
        <div className="buttons-container">
          <AnimatedButton variant='danger' className='button' onClick={cancelStep}>
            Cancelar
          </AnimatedButton>
          <AnimatedButton variant='success' type='submit' className='button' onClick={handleNextStep}>
            Enviar Diagnostico
          </AnimatedButton>
        </div>
      </Form>
    </>
  );
}

export default ReviewedStep;