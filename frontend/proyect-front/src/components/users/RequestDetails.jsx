import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useBackendURL } from '../../contexts/BackendURLContext.jsx';
import AuthContext from '../../contexts/AuthContext.jsx';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function RequestDetails() {
  const { userToken } = useContext(AuthContext);
  const [solicitud, setSolicitud] = useState(null);
  const { id: solicitudId } = useParams();
  const backendURL = useBackendURL();
  const [fechaFormateada, setFechaFormateada] = useState('');
  const navigate = useNavigate();
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

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

  const handleAccept = async () => {
    try {
      await axios.put(`${backendURL}/api/Solicitud/actualizar-estado`, {
        id: solicitud.id,
        idSolicitudServicioEstado: 4 // 4 es el ID para el estado "Aprobada"
      }, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      // Actualizar el estado local o recargar la página para reflejar el cambio
      console.log('Solicitud aceptada');
      setSolicitud(prevSolicitud => ({ ...prevSolicitud, estado: 'Aprobada' }));
      setShowAcceptModal(false);
    } catch (error) {
      console.error('Error al aceptar la solicitud:', error);
    }
  };

  const handleReject = async () => {
    try {
      await axios.put(`${backendURL}/api/Solicitud/actualizar-estado`, {
        id: solicitud.id,
        idSolicitudServicioEstado: 6
      }, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      // Actualizar el estado local o recargar la página para reflejar el cambio
      console.log('Solicitud rechazada');
      setSolicitud(prevSolicitud => ({ ...prevSolicitud, estado: 'Cancelada' }));
      setShowRejectModal(false);
    } catch (error) {
      console.error('Error al rechazar la solicitud:', error);
    }
  };

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
      {(solicitud.estado === 'Presupuestada' || solicitud.estado === 'Aprobada') && (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4>Monto: ${solicitud.monto}</h4>
            {solicitud.estado === 'Presupuestada' && (
              <>
                <Button variant="success" className="button-spacing" onClick={() => setShowAcceptModal(true)}>Aceptar</Button>
                <Button variant="danger" onClick={() => setShowRejectModal(true)}>Rechazar</Button>
              </>
            )}
          </div>
          <div>
            <h4>Fecha Estimada: {new Date(solicitud.fechaEstimada).toLocaleDateString('es-ES')}</h4>
          </div>
        </div>
      )}
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

      <div className='d-flex justify-content-end mt-3'>
        <Button variant='secondary' className='custom-button' onClick={() => navigate('../requests')}>Volver</Button> 
      </div>

      <Modal show={showAcceptModal} onHide={() => setShowAcceptModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Aceptación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas aceptar esta solicitud?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAcceptModal(false)}>
            Atrás
          </Button>
          <Button variant="success" onClick={handleAccept}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Rechazo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas rechazar esta solicitud?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Atrás
          </Button>
          <Button variant="danger" onClick={handleReject}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );

}
