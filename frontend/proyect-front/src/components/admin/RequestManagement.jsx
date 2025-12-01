import { useState, useEffect } from 'react';
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
import { toast } from 'react-toastify';

function RequestManagement() {
  const [solicitud, setSolicitud] = useState(null);
  const { id: solicitudId } = useParams();
  //const [fechaFormateada, setFechaFormateada] = useState('');
  const navigate = useNavigate();

  //UI States
  const [showCancelModalForm, setShowCancelModalForm] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [domicilioModalData, setDomicilioModalData] = useState(null);
  const [ServiceState, setServiceState] = useState(null);

  const steps = ["Iniciada", "Revisada", "Presupuestada", "Aprobada", "Finalizada"];

  const currentStep = solicitud?.estado_nombre || solicitud?.estado || "Iniciada";

  useEffect(() => {
    let isMounted = true; // Flag para saber si el componente sigue vivo
    const fetchSolicitudDetails = async () => {
      try {
        console.log('Fetching solicitud details...');
        const response = await apiService.getRequestByIdAdmin(solicitudId);

        if (isMounted) {

          //console.log('Solicitud details:', response.data);
          setSolicitud(response.data);
        }
      } catch (error) {

        if (isMounted) console.error('Error fetching solicitud details:', error);

      }
    }
    fetchSolicitudDetails();

    return () => { isMounted = false; };
  }, [solicitudId]);

  useEffect(() => {
    const fetchStateDetail = async () => {
      if (solicitud && solicitud.id_solicitud_servicio_estado) {
        try {
          const response = await apiService.getDetailServiceState(solicitud.id_solicitud_servicio_estado);
          //console.log('State detail:', response.data);
          setServiceState(response.data);
        } catch (error) {
          console.error('Error fetching state detail:', error);
        }
      }
    };
    fetchStateDetail();
  }, [solicitud?.id_solicitud_servicio_estado]);

  const executeOptimisticAction = async (updates, apiAction, successMsg = null, errorMsg = "Error al guardar cambios") => {
    const backupSolicitud = JSON.parse(JSON.stringify(solicitud));

    setSolicitud(prev => ({ ...prev, ...updates }));

    try {
      await apiAction();

      console.log("Acción exitosa en servidor");
      if (successMsg) {
        toast.success(successMsg);
      }

    } catch (error) {
      // 4. ROLLBACK AUTOMÁTICO
      console.error("Falló la acción, revirtiendo...", error);

      setSolicitud(backupSolicitud);

      const serverMessage = error.response?.data?.error || error.response?.data?.message || error.response?.data?.detail;
      const finalMessage = serverMessage || errorMsg; //Si no usamos el generico

      toast.error(`${finalMessage}. Se han revertido los cambios.`);
    }
  };
  
  const handleNextStep = async (incomingData = null) => {

    const stepIndex = steps.indexOf(currentStep);
    if (stepIndex >= steps.length - 1) return;

    const nextStepName = steps[stepIndex + 1];

    const uiUpdates = {
      estado: nextStepName,
      estado_nombre: nextStepName,
      ...incomingData
    };

    const apiWorker = async () => {
      const idEstado = stepIndex + 2;
      if (nextStepName === 'Revisada') {
        await apiService.updateRequestStateAdmin({ id: solicitudId, idSolicitudServicioEstado: idEstado });
        await apiService.updateRequestReviewed(solicitudId);
      }
      else if (nextStepName === 'Presupuestada') {
        // Combinamos datos actuales con los nuevos para enviar todo completo
        const source = { ...solicitud, ...incomingData };
        const requestData = {
          id: solicitudId,
          idSolicitudServicioEstado: idEstado,
          diagnosticoTecnico: source.diagnosticoTecnico ?? source.diagnostico_tecnico ?? '',
          monto: source.monto,
          fechaEstimada: source.fechaEstimada ?? source.fecha_estimada ?? null
        };
        await apiService.updateRequestBudgetAdmin(requestData);
      }
      else if (nextStepName === 'Finalizada') {
        const source = { ...solicitud, ...incomingData };
        const requestData = {
          id: solicitudId,
          idSolicitudServicioEstado: idEstado,
          resumen: source.resumen ?? source.Resumen ?? source.localResumen
        };
        await apiService.updateRequestFinished(requestData);
      }
      else {
        // Caso genérico (ej: Aprobada)
        await apiService.updateRequestStateAdmin({ id: solicitudId, idSolicitudServicioEstado: idEstado });
      }
    };

    await executeOptimisticAction(
      uiUpdates,
      apiWorker,
      `Estado actualizado a: ${nextStepName}`,
      `Error al pasar a estado ${nextStepName}`
    );
  };

  const handleConfirmCancel = async (motivoReason) => {
    const prevSolicitud = { ...solicitud };
    setShowCancelModalForm(false);
    const uiUpdates = {
      estado: 'Cancelada',
      estado_nombre: 'Cancelada',
      resumen: motivoReason
    };
    setSolicitud(prev => ({
      ...prev,
      ...uiUpdates
    }));

    const apiWorker = async () => {
      console.log('Canceling request with reason:', motivoReason);
      await apiService.cancelRequest(solicitudId, { resumen: motivoReason });
    };

    await executeOptimisticAction(
      uiUpdates,
      apiWorker,
      'Solicitud cancelada correctamente',
      'No se pudo cancelar la solicitud'
    );
  };

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
    const estadoNombre = currentStep;
    switch (estadoNombre) {
      case 'Iniciada':
        return <StartedStep solicitud={solicitud} nextStep={handleNextStep} cancelStep={handleCancelButton} />;
      case 'Revisada':
        return <ReviewedStep solicitud={solicitud} nextStep={handleNextStep} cancelStep={handleCancelButton} handleChange={handleChange} />;
      case 'Presupuestada':
        return <BudgetedStep solicitud={solicitud} nextStep={handleNextStep} cancelStep={handleCancelButton} handleChange={handleChange} />;
      case 'Aprobada':
        return <ApprovedStep solicitud={solicitud} nextStep={handleNextStep} cancelStep={handleCancelButton} handleChange={handleChange} />;
      case 'Finalizada':
        return <FinishedStep solicitud={solicitud} />;
      case 'Cancelada':
        return <CancelStep solicitud={solicitud} />;
      default:
        if (solicitud.id_solicitud_servicio_estado === 1) return <StartedStep solicitud={solicitud} nextStep={handleNextStep} cancelStep={handleCancelButton} />;
        return <div>Error al obtener el estado</div>;
    }
  };

  const fechaFormateada = solicitud?.fechaGeneracion
    ? new Date(solicitud.fechaGeneracion).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '';

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

      <CancelModalForm
        show={showCancelModalForm}
        onClose={handleCloseCancelModalForm}
        onConfirm={handleConfirmCancel} />

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