import { useEffect, useState } from "react";
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useBackendURL } from '../../../contexts/BackendURLContext.jsx';
import { useParams } from 'react-router-dom';
import "./approvedStep.css";

function ApprovedStep({ solicitud, nextStep, cancelStep, handleChange }) {
  const [fechaFormateada, setFechaFormateada] = useState('');
  const [idCategoria, setIdCategoria] = useState(null);
  const [Resumen, setResumen] = useState('');
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);


  useEffect(() => {
    setIsFormValid(!!solicitud.Resumen);
  }, [solicitud.Resumen]);

  if (!solicitud) {
    return <div>Cargando...</div>;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = {};
    if (!solicitud.Resumen) {
      newErrors.Resumen = "El resumen del trabajo es obligatorio.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    console.log('Solicitud para finalizar:', solicitud);
    console.log('Resumen del trabajo:', solicitud.Resumen);
    nextStep();
  };

  return (
    <>
      <div className="data-container budgeted-step-container">
        <Form className='reviewed-step-form'>
          <div className='row reviewed-show'>
          <div className='col-diagnostic'>
            <Form.Group controlId='diagnostic'>
              <Form.Label>Diagnostico</Form.Label>
              <Form.Control
                as='textarea'
                rows={5}
                type='text'
                value={solicitud.diagnosticoTecnico}
                readOnly
              />
            </Form.Group>
          </div>
          <div className='col-amount'>
            <Form.Group controlId='estimated-date'>
              <Form.Label>Fecha estimada</Form.Label>
              <Form.Control
                type='date'
                value={solicitud.fechaEstimada ? new Date(solicitud.fechaEstimada).toISOString().split('T')[0] : ''}
                readOnly
              />
            </Form.Group>
            <Form.Group className="amount-form" controlId='amount'>
              <Form.Label>Monto</Form.Label>
              <Form.Control
                type='number'
                value={solicitud.monto || ''}
                readOnly
              />
            </Form.Group>
          </div>
        </div>
        </Form>
      </div>
      <Form className='reviewed-step-form' onSubmit={handleSubmit}>
        <div className='row'>
          <div className='col-diagnostic'>
            <Form.Group controlId='diagnostic'>
              <Form.Label>Resumen del trabajo</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                type='text'
                placeholder='Ingrese el resumen'
                name='Resumen'
                value={solicitud.Resumen}
                onChange={handleChange}
                required
              />
              {errors.Resumen && <p className="error-text" style={{ color: 'red', fontSize: 'small' }}>{errors.Resumen}</p>}
            </Form.Group>
          </div>
          <div className='button-group approvedStep'>
            <Button variant='danger' className='button' onClick={cancelStep}>
              Cancelar
            </Button>
            <Button variant='success' type='submit' className='button' disabled={!isFormValid}>
              Enviar resumen
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
}

export default ApprovedStep;