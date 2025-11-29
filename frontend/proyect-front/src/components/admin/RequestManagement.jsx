import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Modal } from 'react-bootstrap';
import StepProgressBar from './RequestManagmentSteps/StepProgressBar.jsx';
import StartedStep from './RequestManagmentSteps/StartedStep.jsx';
import ReviewedStep from './RequestManagmentSteps/ReviewedStep.jsx';
import BudgetedStep from './RequestManagmentSteps/BudgetedStep.jsx';
import ApprovedStep from './RequestManagmentSteps/ApprovedStep.jsx';
import FinishedStep from './RequestManagmentSteps/FinishedStep.jsx';
import CancelModalForm from './RequestManagmentSteps/CancelModalForm.jsx';
import apiService from '../../services/axiosConfig.jsx';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTableCellsLarge, faScrewdriverWrench } from "@fortawesome/free-solid-svg-icons";
import AddressCard from '../users/UserAddressCard.jsx';
import { Button } from 'react-bootstrap';
import './RequestManagement.css';
import CancelStep from './RequestManagmentSteps/CancelStep.jsx';

function RequestManagement() {
  const [solicitud, setSolicitud] = useState(null);
  const { id: solicitudId } = useParams();
  const [fechaFormateada, setFechaFormateada] = useState('');
  const navigate = useNavigate();
  const steps = ["Iniciada", "Revisada", "Presupuestada", "Aprobada", "Finalizada"];
  const [currentStep, setCurrentStep] = useState("Iniciada");
  const [showCancelModalForm, setShowCancelModalForm] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [domicilioModalData, setDomicilioModalData] = useState(null);
  const [ServiceState, setServiceState] = useState(null);

  useEffect(() => {
    const fetchSolicitudDetails = async () => {
      try {
        console.log('Fetching solicitud details...');
        const response = await apiService.getRequestByIdAdmin(solicitudId);
        console.log('Solicitud details:', response.data);
        setSolicitud(response.data);
        // ahora el backend devuelve 'estado_nombre' (texto) y 'id_solicitud_servicio_estado' (id numérico)
        setCurrentStep(response.data.estado_nombre || response.data.estado || response.data.id_solicitud_servicio_estado);
        const fechaGeneracion = new Date(response.data.fechaGeneracion);
        console.log('Fecha de generación:', fechaGeneracion);
        const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
        setFechaFormateada(fechaGeneracion.toLocaleDateString('es-ES', opciones));
      } catch (error) {
        console.error('Error fetching solicitud details:', error);
      }
    }
    fetchSolicitudDetails();
  }, [solicitudId]);

  useEffect(() => {
    const fetchStateDetail = async () => {
      if (solicitud && solicitud.id_solicitud_servicio_estado) {
        try {
          const response = await apiService.getDetailServiceState(solicitud.id_solicitud_servicio_estado);
          console.log('State detail:', response.data);
          setServiceState(response.data);
        } catch (error) {
          console.error('Error fetching state detail:', error);
        }
      }
    };
    fetchStateDetail();
  }, [solicitud]);

  const updateSolicitudEstado = async (newStep, stepIndex) => {
    try {
      console.log('Updating request state...');
      const requestData = { id: solicitudId, idSolicitudServicioEstado: stepIndex + 2 };
      await apiService.updateRequestStateAdmin(requestData);
      setCurrentStep(newStep);
      setSolicitud(prevSolicitud => ({
        ...prevSolicitud,
        estado: newStep
      }));
      console.log('Updated solicitud:', {
        ...solicitud,
        estado: newStep
      });
    } catch (error) {
      console.error('Error updating request state:', error);
    }
  };
  /*const updateSolicitudEnvio = async (solicitud) => {
    try {
      console.log('Updating request deliver...');
      await apiService.updateRequestDeliverAdmin(solicitud.id, solicitud.envio);
      console.log('Updated request deliver');
    } catch (error) {
      console.error('Error updating request state:', error);
    }
  };*/

  const updateRequestBudgeted = async () => {
    try {
      const stepIndex = steps.indexOf(currentStep);
      const newStep = steps[stepIndex + 1];
      console.log('Updating request state...', solicitud);
      const requestData = {
        id: solicitudId,
        diagnosticoTecnico: solicitud.diagnostico_tecnico,
        idSolicitudServicioEstado: stepIndex + 2,
        monto: solicitud.monto,
        fechaEstimada: solicitud.fecha_estimada
      };
      await apiService.updateRequestBudgetAdmin(requestData);
      setCurrentStep(newStep);
      setSolicitud(prevSolicitud => ({
        ...prevSolicitud,
        estado: newStep
      }));
      console.log('Updated solicitud:', {
        ...solicitud,
        estado: newStep
      });
    } catch (error) {
      console.error('Error updating request state:', error);
    }
  };

  const UpdateRequestFinished = async () => {
    try {
      const stepIndex = steps.indexOf(currentStep);
      const newStep = steps[stepIndex + 1];
      console.log('Updating request state...', solicitud);
      const requestData = {
        id: solicitudId,
        resumen: solicitud.resumen,
        idSolicitudServicioEstado: stepIndex + 2,
      };
      await apiService.updateRequestFinished(requestData);
      setCurrentStep(newStep);
      setSolicitud(prevSolicitud => ({
        ...prevSolicitud,
        estado: newStep
      }));
      console.log('Updated solicitud:', {
        ...solicitud,
        estado: newStep
      });
    } catch (error) {
      console.error('Error updating request state:', error);
    }
  };

  const nextStep = async () => {
    console.log('Next step');
    const stepIndex = steps.indexOf(currentStep);
    console.log('stepIndex:', stepIndex);
    if (stepIndex < steps.length - 1 && steps[stepIndex + 1] !== 'Presupuestada' && steps[stepIndex + 1] !== 'Revisada' && steps[stepIndex + 1] !== 'Finalizada') {
      const newStep = steps[stepIndex + 1];
      console.log('step viejo:', newStep);
      await updateSolicitudEstado(newStep, stepIndex);
      console.log('Updated step nuevo:', newStep);
    }
    if (steps[stepIndex + 1] === 'Revisada') {
      const newStep = steps[stepIndex + 1];
      const id = solicitud.id;
      await updateSolicitudEstado(newStep, stepIndex);
      await apiService.updateRequestReviewed(id);
    }

    if (steps[stepIndex + 1] === 'Presupuestada') {
      console.log('Solicitud: ', solicitud);
      await updateRequestBudgeted();
    }
    if (steps[stepIndex + 1] === 'Finalizada') {
      console.log('Solicitud: ', solicitud);
      await UpdateRequestFinished();
    }
  };
  /*const handleSubcontractStep = async () => {
    const stepIndex = steps.indexOf(currentStep);
    const newStep = steps[stepIndex + 1];
    const requestData = {
      id: solicitud.id,
      idSolicitudServicioEstado: 2,
      tercearizado: true,
      idEmpresa: 1,
      IdSolicitudExterna: solicitud.IdSolicitudExterna,
    };

    console.log('data to send:', requestData);

    if (solicitud.con_logistica) await updateSolicitudEnvio(solicitud);
    await apiService.updateRequestSubcontractAdmin(requestData);
    setCurrentStep(newStep);
    setSolicitud(prevSolicitud => ({
      ...prevSolicitud,
      estado: newStep
    }));
    console.log('Updated solicitud:', {
      ...solicitud,
      estado: newStep
    });

  };
  */
  const handleCancelButton = () => {
    setShowCancelModalForm(true);
  };

  const handleCloseCancelModalForm = () => {
    setShowCancelModalForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSolicitud((prevSolicitud) => ({
      ...prevSolicitud,
      [name]: value,
    }));
  };

  if (!solicitud) {
    return <div>Cargando...</div>;
  }

  const renderContent = () => {
    const estadoNombre = solicitud.estado_nombre || solicitud.estado || solicitud.id_solicitud_servicio_estado;
    switch (estadoNombre) {
      case 'Iniciada':
        return <StartedStep solicitud={solicitud} nextStep={nextStep} cancelStep={handleCancelButton} />;
      case 'Revisada':
        return <ReviewedStep solicitud={solicitud} nextStep={nextStep} cancelStep={handleCancelButton} handleChange={handleChange} />;
      case 'Presupuestada':
        return <BudgetedStep solicitud={solicitud} nextStep={nextStep} cancelStep={handleCancelButton} handleChange={handleChange} />;
      case 'Aprobada':
        return <ApprovedStep solicitud={solicitud} nextStep={nextStep} cancelStep={handleCancelButton} handleChange={handleChange} />;
      case 'Finalizada':
        return <FinishedStep solicitud={solicitud} />;
      case 'Cancelada':
        return <CancelStep solicitud={solicitud} />;
      default:
        return <div>Error al obtener el estado</div>;
    }
  };

  return (
    <div className='requestManagement w-100'>
      <div className='requestManagement-header'>
        <div className='d-flex align-items-start justify-content-between'>
          <Button style={{ width: '80px' }} variant="outline-dark" onClick={() => navigate('/admin/requests')}>
            Volver
          </Button>
          <div className='flex-grow-1 text-center'>
            <h2>Gestión de solicitud #{solicitudId}</h2>
            <p style={{ color: 'gray' }}>
              Generada: {fechaFormateada}
            </p>
          </div>
          <div style={{ width: '80px' }}></div>
        </div>
      </div>
      <StepProgressBar solicitud={solicitud} currentStep={currentStep} />
      {((solicitud.estado_nombre || solicitud.estado || solicitud.id_solicitud_servicio_estado) === 'Cancelada' && !solicitud.fecha_iniciada) && (
      <div className="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>¡Atención!</strong> La solicitud ha sido <strong>cancelada</strong>.
      </div>
      )}
      <hr style={{ borderTop: '1px solid lightgray', margin: '1%' }} />
      <div className='details d-flex flex-row justify-content' >
        <div className="user-details ms-3 p-3 border rounded shadow-sm bg-light mb-2">
          <div className="d-flex flex-column">
            <span className="mb-2 fw-bold">Usuario</span>
            <span>{solicitud.emailSolicitante}</span>
          </div>
        </div>
        <div className="service-details ms-3 p-3 border rounded shadow-sm bg-light mb-2">
          <div className="d-flex flex-column">
            <span className="mb-2"><b>Servicio:</b><span className='ms-2'>{solicitud.tipoServicio}</span></span>
            {solicitud.tipoServicio === 'mantenimiento' && (<span><b>Tipo: </b>{solicitud.mantenimiento?.nombre}</span>)}
          </div>
        </div>
        <div className="logistics-details ms-3 p-3 border rounded shadow-sm bg-light mb-2">
          <div className="d-flex flex-column">
            <span className="mb-2 "><b>A domicilio:</b>
              <span className='ms-2'></span>{solicitud.con_logistica ? 'Si' : 'No'}
            </span>
            {solicitud.con_logistica && (
              <div className="mt-2">
                <button className="btn btn-link p-0" onClick={async () => {
                  try {
                    const resp = await apiService.getProfiles();
                    const profiles = resp.data || [];
                    const profile = profiles.find(p => p.email === solicitud.emailSolicitante || (p.id && p.id.email === solicitud.emailSolicitante));
                    const domicilio = profile?.domicilio ?? null;
                    setDomicilioModalData(domicilio);
                    setShowAddressModal(true);
                  } catch (err) {
                    console.error('Error fetching profiles for address modal:', err);
                    setDomicilioModalData(null);
                    setShowAddressModal(true);
                  }
                }}>
                  Ver domicilio
                </button>
              </div>
            )}
            
          </div>
        </div>
        
      </div>
      <div className='row d-flex request-basics p-3'>
        <div className='col-4'>
          <Form.Label className="fw-bold">
            <FontAwesomeIcon icon={faTableCellsLarge} className="me-2" />
            Categoria
          </Form.Label>
          <Form.Control
            type='text'
            value={solicitud.categoria || ""}
            readOnly
          >
          </Form.Control>
        </div>
        <div className='col-4'>
          <Form.Label className="fw-bold">
            <FontAwesomeIcon icon={faScrewdriverWrench} className="me-2" />
            Producto
          </Form.Label>
          <Form.Control
            type='text'
            value={solicitud.producto}
            readOnly
          >
          </Form.Control>
        </div>
      </div>
      <div className='d-flex request-details p-3 mb-4'>
        <div className='flex-grow-1'>
          {renderContent()}
        </div>
      </div>
      <div className="d-flex justify-content-center" style={{ height: '50px' }}></div>
      <CancelModalForm show={showCancelModalForm} onClose={handleCloseCancelModalForm} />

      <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Domicilio del solicitante</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {domicilioModalData ? (
            <AddressCard
              street={domicilioModalData.calle || 'No especificado'}
              province={domicilioModalData.provincia || 'No especificado'}
              locality={domicilioModalData.localidad_nombre || 'No especificado'}
              zipCode={domicilioModalData.codigo_postal || 'No especificado'}
              floor={domicilioModalData.piso || ''}
              department={domicilioModalData.departamento || ''}
              noHover={true}
            />
          ) : (
            <div className="text-center">No se encontró un domicilio para este usuario.</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddressModal(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default RequestManagement;