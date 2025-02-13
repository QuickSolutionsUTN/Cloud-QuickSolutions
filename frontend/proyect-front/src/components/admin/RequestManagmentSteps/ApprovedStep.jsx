import { useEffect, useState } from "react";
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useBackendURL } from '../../../contexts/BackendURLContext.jsx';
import { useParams } from 'react-router-dom';
import "./approvedStep.css";

function ApprovedStep({ nextStep, cancelStep }) {
  const [solicitud, setSolicitud] = useState(null);
  const { id: solicitudId } = useParams();
  const backendURL = useBackendURL();
  const navigate = useNavigate();
  const [fechaFormateada, setFechaFormateada] = useState('');
  const [idCategoria, setIdCategoria] = useState(null);

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
  }, [solicitudId]);

  if (!solicitud) {
    return <div>Cargando...</div>;
  }

  const handleSubmit = (event) => {
      event.preventDefault();
      nextStep();
  };

  return (
    <>
      <div className="data-container budgeted-step-container">
        <Form className='reviewed-step-form'>
          <div className='row my-3'>
            <div className='col-4'>
              <Form.Label>Servicio</Form.Label>
              <Form.Control
                type='text'
                defaultValue={solicitud.tipoServicio}
                readOnly
              >
              </Form.Control>
            </div>
            <div className='col-4'>
              <Form.Label>Categoria</Form.Label>
              <Form.Control
                type='text'
                value={solicitud.categoria}
                readOnly
              >
              </Form.Control>
            </div>
            <div className='col-4'>
              <Form.Label>Producto</Form.Label>
              <Form.Control
                type='text'
                value={solicitud.tipoDeProducto}
                readOnly
              >
              </Form.Control>
            </div>
          </div>
          <div className='row reviewed-show'>
          <div className='col-diagnostic'>
            <Form.Group controlId='diagnostic'>
              <Form.Label>Diagnostico</Form.Label>
              <Form.Control
                as='textarea'
                rows={5}
                type='text'
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
              />
            </Form.Group>
          </div>
          <div className='button-group approvedStep'>
            <Button variant='danger' className='button' onClick={cancelStep} >
              Cancelar
            </Button>
            <Button variant='success' type='submit' className='button' onClick={nextStep}>
              Enviar resumen
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
}

export default ApprovedStep;