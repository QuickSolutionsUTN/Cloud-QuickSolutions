import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useBackendURL } from '../../contexts/BackendURLContext.jsx';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function RequestDetails() {
  const [solicitud, setSolicitud] = useState(null);
  const { id: solicitudId } = useParams();
  const backendURL = useBackendURL();
  const [fechaFormateada, setFechaFormateada] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSolicitudDetails = async () => {
      try {
        console.log('Fetching solicitud details...', backendURL);
        const response = await axios.get(`${backendURL}/api/solicitud/${solicitudId}`);
        console.log('Solicitud details:', response.data);
        setSolicitud(response.data);
        const fechaGeneracion= new Date(response.data.fechaGeneracion);
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

  
  return (
    <>
      <div className="title-container space-between mb-4">
        <h2>Resumen solicitud #{solicitudId}</h2>
      </div>

      <div className="subtitle-container mb-4">
        <h4>Estado: {solicitud.estado}</h4>
        <h4>Fecha: {fechaFormateada}</h4>
      </div>
      <div className="my-4"></div>

      <Form className='data-container'>
        <div className='row my-3'>
          <div className='col-4'>
            <Form.Label>Email</Form.Label>

            <Form.Control
              type='text'
              defaultValue={solicitud.emailSolicitante}
              readOnly
            >
            </Form.Control>
          </div>
        </div>
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

        <div className="my-4"></div>
        <div className='row'>
          <div className='col-12'>
            <Form.Group controlId='descripcion'>
            <Form.Label>Descripcion del problema</Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              type='text'
              value={solicitud.descripcion}
              readOnly
              style={{ resize: 'vertical' }}
            />
            </Form.Group>
          </div>
        </div>
        <div className='row my-3'>
          <div className='col-4'>
            <Form.Check 
              type='checkbox' 
              label='Con servicio de logistica' 
              checked={solicitud.conLogistica} 
              readOnly 
            />
          </div>
        </div>
      </Form>

      <div className='buttons-container'>
        <Button variant='secondary' className='custom-button' onClick={() => navigate('../requests')}>Volver</Button> 
      </div>
    </>
  );

}
