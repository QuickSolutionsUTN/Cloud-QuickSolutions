import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Form } from 'react-bootstrap';
import { useBackendURL } from '../../../contexts/BackendURLContext.jsx';
import { useParams } from 'react-router-dom';
import "./finishedStep.css";

function FinishedStep() {
  const [solicitud, setSolicitud] = useState(null);
  const { id: solicitudId } = useParams();
  const backendURL = useBackendURL();

  useEffect(() => {
    const fetchSolicitudDetails = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/solicitud/${solicitudId}`);
        setSolicitud(response.data);
      } catch (error) {
        console.error('Error fetching solicitud details:', error);
      }
    }
    fetchSolicitudDetails();
  }, [solicitudId]);

  const adjustTextareaHeight = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  useEffect(() => {
    if (solicitud) {
      const textarea = document.getElementById('summary');
      if (textarea) {
        adjustTextareaHeight({ target: textarea });
      }
    }
  }, [solicitud]);

  if (!solicitud) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="data-container finished-step-container">
      <Form>
        <div className='row my-3'>
          <div className='col-4'>
            <Form.Label>Servicio</Form.Label>
            <Form.Control
              type='text'
              defaultValue={solicitud.tipoServicio}
              readOnly
            />
          </div>
          <div className='col-4'>
            <Form.Label>Categoria</Form.Label>
            <Form.Control
              type='text'
              value={solicitud.categoria}
              readOnly
            />
          </div>
          <div className='col-4'>
            <Form.Label>Producto</Form.Label>
            <Form.Control
              type='text'
              value={solicitud.tipoDeProducto}
              readOnly
            />
          </div>
        </div>
        <div className='row my-3'>
          <div className='col-6 diagnostic-column'>
            <Form.Group controlId='diagnostic'>
              <Form.Label>Diagnostico</Form.Label>
              <Form.Control
                as='textarea'
                type='text'
                value={solicitud.diagnosticoTecnico}
                readOnly
                style={{ resize: 'none' }}
              />
            </Form.Group>
          </div>
          <div className='col-6 amount-column'>
            <Form.Group controlId='estimated-date'>
              <Form.Label>Fecha estimada</Form.Label>
              <Form.Control
                type='date'
                value={solicitud.fechaEstimada ? new Date(solicitud.fechaEstimada).toISOString().split('T')[0] : ''}
                readOnly
              />
            </Form.Group>
            <Form.Group controlId='amount'>
              <Form.Label>Monto</Form.Label>
              <Form.Control
                type='number'
                value={solicitud.monto}
                readOnly
              />
            </Form.Group>
          </div>
        </div>
        <div className='row my-3'>
          <div className='col-12'>
            <Form.Group controlId='summary'>
              <Form.Label>Resumen del trabajo</Form.Label>
              <Form.Control
                as='textarea'
                type='text'
                value={solicitud.resumen}
                readOnly
                style={{ resize: 'none', overflow: 'hidden' }}
                onInput={adjustTextareaHeight}
              />
            </Form.Group>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default FinishedStep;