import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Modal, ToastContainer, Toast, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useBackendURL } from '../../contexts/BackendURLContext.jsx';
import AuthContext from '../../contexts/AuthContext.jsx';
import { useParams } from 'react-router-dom';
import apiService from '../../services/axiosConfig.jsx';
import envioService from '../../services/apiEnviosService.jsx';

export default function RequestDetails() {
  const { userToken } = useContext(AuthContext);
  const [solicitud, setSolicitud] = useState(null);
  const { id: solicitudId } = useParams();
  const backendURL = useBackendURL();
  const [fechaFormateada, setFechaFormateada] = useState('');
  const navigate = useNavigate();
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [badgeVariant, setBadgeVariant] = useState('primary');
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [envioDetails, setEnvioDetails] = useState({
    estado: '', origen: null, fecha: null
  });

  useEffect(() => {
    const fetchSolicitudDetails = async () => {
      try {
        console.log('Fetching solicitud details...', backendURL);
        const response = await axios.get(`${backendURL}/api/solicitud/${solicitudId}`);
        console.log('Solicitud details:', response.data);
        setSolicitud(response.data);
        const fechaGeneracion = new Date(response.data.fechaGeneracion);
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        setFechaFormateada(fechaGeneracion.toLocaleDateString('es-ES', opciones));
        setBadgeVariant(getBadgeVariant(response.data.estado));
      } catch (error) {
        console.error('Error fetching solicitud details:', error);
      }
    }
    const getBadgeVariant = (estado) => {
      switch (estado) {
        case 'Revisada':
          return 'secondary';
        case 'Presupuestada':
          return 'warning';
        case 'Aprobada':
          return 'success';
        case 'Cancelada':
          return 'danger';
        case 'Finalizada':
          return 'secondary';
        default:
          return 'primary';
      }
    };
    fetchSolicitudDetails();
  }, [solicitudId]);

  const handleAccept = async () => {
    const dataToUpdate = {
      id: solicitud.id,
      idSolicitudServicioEstado: 4
    };
    updateRequest(dataToUpdate, 'Aprobada');
    window.location.reload();
    setShowAcceptModal(false);
  };

  const handleReject = async () => {
    const dataToUpdate = {
      id: solicitud.id,
      idSolicitudServicioEstado: 6
    };
    updateRequest(dataToUpdate, 'Cancelada');
    setShowRejectModal(false);
  };

  const updateRequest = async (data, estado) => {
    try {
      const response = await apiService.updateRequestUser(data);
      console.log('Solicitud actualizada', response.data);
    } catch (error) {
      console.error('Error al aceptar la solicitud:', error);
      handleError();
    }
  };

  const handleError = () => {
    setErrorMessage("Hubo un problema al actualizar la solicitud.");
    setShowToast(true);
  };

  // Función que cambia el estado al hacer clic
  const handleToggleDeliverDetails = () => {
    console.log('Solicitando detalles de envio a la API veloway...');
    getEnvioDetails();
    setMostrarDetalles(!mostrarDetalles);
  };

  const getEnvioDetails = async () => {
    try {
      const response = await envioService.getEnvio(solicitud.envio.nroSeguimiento);
      console.log('Detalles del envio:', response);
      setEnvioDetails({ estado: response.estado, origen: response.origen, fecha: response.fecha });
      console.log('Detalles del envio:', envioDetails);
    } catch (error) {
      console.error('Error al obtener los detalles del envio:', error);
    }
  };



  if (!solicitud) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <div className="title-container space-between mb-">
        <h3>Solicitud ID: {solicitudId}
          <Badge className="m-2" bg={badgeVariant}>{solicitud.estado}</Badge>
        </h3>
      </div>

      <div className="subtitle-container mb-4">
        <h5>{fechaFormateada}</h5>
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
        {solicitud.diagnosticoTecnico? (
          <div className="my-4">
            <div className='row'>
              <div className='col-12'>
                <Form.Group controlId='descripcion'>
                  <Form.Label>Diagnostico Tecnico</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={3}
                    type='text'
                    value={solicitud.diagnosticoTecnico}
                    readOnly
                    style={{ resize: 'vertical' }}
                  />
                </Form.Group>
              </div>
            </div>
          </div>
        ) : null}
        <hr />

        {solicitud.conLogistica && solicitud.envio !== null ? (
          <>
            <div className='row my-3'><div className='col-12'><h5>Con servicio de logistica</h5></div></div>
            <div className="col-12 row my-3">
              <div className="col-8">
                <h5>Nro de seguimiento: {solicitud.envio.nroSeguimiento}</h5>
              </div>

              <div className="col-4 text-end">
                <Button variant="outline-primary" onClick={handleToggleDeliverDetails}>
                  {mostrarDetalles ? 'Ocultar detalles' : 'Consultar envío'}
                </Button>
              </div>
              {mostrarDetalles && (
                <div className="mt-3">
                  <p><strong>Fecha de solicitud:</strong> {envioDetails.fecha}</p>
                  <p><strong>Estado:</strong> {envioDetails.estado}</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className='col-4'>
            <h5>Sin servicio de logistica</h5>
          </div>
        )}
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

      <ToastContainer position="top-end" className="p-3">
        <Toast bg="danger" onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto text-white">Error</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{errorMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );

}
