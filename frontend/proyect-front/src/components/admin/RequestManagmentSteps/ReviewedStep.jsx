import { useEffect, useState } from "react";
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useBackendURL } from '../../../contexts/BackendURLContext.jsx';
import { useParams } from 'react-router-dom';
import "./reviewedStep.css"

function ReviewedStep({solicitud, nextStep, cancelStep, handleChange }) {
  const { id: solicitudId } = useParams();
  const backendURL = useBackendURL();
  const navigate = useNavigate();
  const [fechaFormateada, setFechaFormateada] = useState('');
  const [idCategoria, setIdCategoria] = useState(null);
  const [diagnostico, setDiagnostico] = useState('');
  const [fechaEstimada, setFechaEstimada] = useState('');
  const [monto, setMonto] = useState('');
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const isValid = solicitud.diagnosticoTecnico && solicitud.monto && solicitud.fechaEstimada;
    setIsFormValid(isValid);
  }, [solicitud]);

  const handleNextStep = (event) => {
    event.preventDefault();
    const newErrors = {};
    if (!solicitud.diagnosticoTecnico) {
      newErrors.diagnosticoTecnico = "El diagnóstico es obligatorio.";
    }
    if (!solicitud.monto) {
      newErrors.monto = "El monto es obligatorio.";
    }
    if (!solicitud.fechaEstimada) {
      newErrors.fechaEstimada = "La fecha estimada es obligatoria.";
    } else {
      const today = new Date();
      const estimatedDate = new Date(solicitud.fechaEstimada);
      if (estimatedDate <= today) {
        newErrors.fechaEstimada = "La fecha estimada debe ser posterior a la fecha actual.";
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    nextStep();
  };

  /*
  useEffect(() => {
    const fetchSolicitudDetails = async () => {
      try {
        console.log('Fetching solicitud details...', backendURL);
        const response = await axios.get(`${backendURL}/api/solicitud/${solicitudId}`);
        console.log('Solicitud details:', response.data);
        setSolicitud(response.data);
        const fechaGeneracion = new Date(response.data.fechaGeneracion);
        const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
        setFechaFormateada(fechaGeneracion.toLocaleDateString('es-ES', opciones));
      } catch (error) {
        console.error('Error fetching solicitud details:', error);
      }
    }
    fetchSolicitudDetails();
  }, [solicitudId]);*/

  if (!solicitud) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <Form className='data-container'>
          <div className='row my-3'>
            <div className='col-4'>
              <Form.Label>Servicio</Form.Label>
              <Form.Control
                type='text'
                defaultValue={solicitud.tipoServicio || ""}
                readOnly
              >
              </Form.Control>
            </div>
            <div className='col-4'>
              <Form.Label>Categoria</Form.Label>
              <Form.Control
                type='text'
                value={solicitud.categoria || ""}
                readOnly
              >
              </Form.Control>
            </div>
            <div className='col-4'>
              <Form.Label>Producto</Form.Label>
              <Form.Control
                type='text'
                value={solicitud.tipoDeProducto || ""}
                readOnly
              >
              </Form.Control>
            </div>
          </div>
          <div className="my-4"></div>
          <div className='row'>
            <div className='col-12'>
              <Form.Group controlId='description'>
                <Form.Label>Descripcion del problema</Form.Label>
                <Form.Control
                  as='textarea'
                  rows={3}
                  type='text'
                  value={solicitud.descripcion || ""}
                  readOnly
                  style={{ resize: 'vertical' }}
                />
              </Form.Group>
            </div> 
          </div>
          <div className="my-4"></div>
      </Form>
      <Form className='reviewed-step-form'>
        <div className='row'>
          <div className='col-diagnostic'>
            <Form.Group controlId='diagnostic'>
              <Form.Label>Diagnostico</Form.Label>
              <Form.Control
                as='textarea'
                rows={5}
                type='text'
                placeholder='Ingrese el diagnostico'
                name='diagnosticoTecnico'
                value={solicitud.diagnosticoTecnico}
                onChange={handleChange}
                required
              />
              {errors.diagnosticoTecnico && <p className="error-text" style={{ color: 'red', fontSize: 'small' }}>{errors.diagnosticoTecnico}</p>}
            </Form.Group>
          </div>
          <div className='col-amount'>
            <Form.Group controlId='estimated-date'>
              <Form.Label>Fecha estimada</Form.Label>
              <Form.Control
                type='date'
                name="fechaEstimada"
                value={solicitud.fechaEstimada}
                onChange={handleChange}
                required
              />
              {errors.fechaEstimada && <p className="error-text" style={{ color: 'red', fontSize: 'small' }}>{errors.fechaEstimada}</p>}
            </Form.Group>
            <Form.Group className='amount-form-label' controlId='amount'>
              <Form.Label>Monto</Form.Label>
              <Form.Control
                type='number'
                placeholder='Ingrese el monto'
                name='monto'
                value={solicitud.monto}
                onChange={handleChange}
                required
              />
              {errors.monto && <p className="error-text" style={{ color: 'red', fontSize: 'small' }}>{errors.monto}</p>}
            </Form.Group>
          </div>
        </div>
        <div className='button-group'>
          <Button variant='danger' className='button' onClick={cancelStep}>
            Cancelar
          </Button>
          <Button variant='success' type='submit' className='button' onClick={handleNextStep} disabled={!isFormValid}>
            Enviar Diagnostico
          </Button>
        </div>
      </Form>
    </>
  );
}

export default ReviewedStep;