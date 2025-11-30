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
import { Toast, ToastContainer } from 'react-bootstrap'
import { set } from 'react-hook-form';

function RequestManagement() {
  const [solicitud, setSolicitud] = useState(null);
  const { id: solicitudId } = useParams();
  const [fechaFormateada, setFechaFormateada] = useState('');
  const navigate = useNavigate();
  //const [currentStep, setCurrentStep] = useState("Iniciada");
  //UI States
  const [showCancelModalForm, setShowCancelModalForm] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [domicilioModalData, setDomicilioModalData] = useState(null);
  const [ServiceState, setServiceState] = useState(null);
  const [toastConfig, setToastConfig] = useState({ show: false, message: '', variant: 'danger' });

  const steps = ["Iniciada", "Revisada", "Presupuestada", "Aprobada", "Finalizada"];

  const currentStep = solicitud?.estado_nombre || solicitud?.estado || "Iniciada";

  useEffect(() => {
    const fetchSolicitudDetails = async () => {
      try {
        console.log('Fetching solicitud details...');
        const response = await apiService.getRequestByIdAdmin(solicitudId);
        //console.log('Solicitud details:', response.data);
        setSolicitud(response.data);
        // ahora el backend devuelve 'estado_nombre' (texto) y 'id_solicitud_servicio_estado' (id numérico)
        const currentStep = solicitud?.estado_nombre || solicitud?.estado || "Iniciada";
        //setCurrentStep(response.data.estado_nombre || response.data.estado || response.data.id_solicitud_servicio_estado);
        const fechaGeneracion = new Date(response.data.fechaGeneracion);
        //console.log('Fecha de generación:', fechaGeneracion);
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
  }, [solicitud?.id_solicitud_servicio_estado]);

  const executeOptimisticAction = async (updates, apiAction, successMsg = null, errorMsg = "Error al guardar cambios") => {
    const backupSolicitud = JSON.parse(JSON.stringify(solicitud));

    setSolicitud(prev => ({ ...prev, ...updates }));

    try {
      // 3. LLAMADA AL BACKEND
      await apiAction();

      console.log("Acción exitosa en servidor");
      if (successMsg) {
        setToastConfig({ show: true, message: successMsg, variant: 'success' });
      }

    } catch (error) {
      // 4. ROLLBACK AUTOMÁTICO
      console.error("Falló la acción, revirtiendo...", error);

      // Forzamos nueva referencia para asegurar re-render
      setSolicitud({ ...backupSolicitud });

      setToastConfig({
        show: true,
        message: `${errorMsg}. Se han revertido los cambios.`,
        variant: 'danger'
      });
    }
  };

  const updateSolicitudEstado = async (newStep, stepIndex) => {
    try {
      console.log('Updating request state...');
      const requestData = { id: solicitudId, idSolicitudServicioEstado: stepIndex + 2 };
      await apiService.updateRequestStateAdmin(requestData);
      const currentStep = solicitud?.estado_nombre || solicitud?.estado || "Iniciada";
      //setCurrentStep(newStep);
      setSolicitud(prevSolicitud => ({
        ...prevSolicitud,
        estado: newStep,
        estado_nombre: newStep
      }));
      console.log('Updated solicitud:', {
        ...solicitud,
        estado: newStep
      });
    } catch (error) {
      console.error('Error updating request state:', error);
    }
  };

  const updateRequestBudgeted = async (dataSource = null) => {
    try {
      const stepIndex = steps.indexOf(currentStep);
      const newStep = steps[stepIndex + 1];
      console.log('Updating request state...', solicitud);
      const source = dataSource || solicitud;
      const requestData = {
        id: solicitudId,
        diagnosticoTecnico: source.diagnosticoTecnico ?? source.diagnostico_tecnico ?? '',
        idSolicitudServicioEstado: stepIndex + 2,
        monto: source.monto ?? solicitud.monto,
        fechaEstimada: source.fechaEstimada ?? source.fecha_estimada ?? null
      };
      await apiService.updateRequestBudgetAdmin(requestData);
      const currentStep = solicitud?.estado_nombre || solicitud?.estado || "Iniciada";
      //setCurrentStep(newStep);
      setSolicitud(prevSolicitud => ({
        ...prevSolicitud,
        estado: newStep,
        estado_nombre: newStep
      }));
      console.log('Updated solicitud:', {
        ...solicitud,
        estado: newStep
      });
    } catch (error) {
      console.error('Error updating request state:', error);
    }
  };

  const UpdateRequestFinished = async (dataSource = null) => {
    try {
      const stepIndex = steps.indexOf(currentStep);
      const newStep = steps[stepIndex + 1];
      const source = dataSource || solicitud;
      console.log('Updating request state...', source);
      const requestData = {
        id: solicitudId,
        resumen: source.resumen ?? source.Resumen ?? source.localResumen,
        idSolicitudServicioEstado: stepIndex + 2,
      };
      await apiService.updateRequestFinished(requestData);
      const currentStep = solicitud?.estado_nombre || solicitud?.estado || "Iniciada";
      //setCurrentStep(newStep);
      setSolicitud(prevSolicitud => ({
        ...prevSolicitud,
        estado: newStep,
        estado_nombre: newStep,
        resumen: requestData.resumen,
        Resumen: requestData.resumen
      }));
      console.log('Updated solicitud:', {
        ...solicitud,
        estado: newStep
      });
    } catch (error) {
      console.error('Error updating request state:', error);
    }
  };

  const handleNextStep = async (incomingData = null) => {

    //const mergedSolicitud = incomingData ? { ...solicitud, ...incomingData } : solicitud;
    const stepIndex = steps.indexOf(currentStep);
    if (stepIndex < steps.length - 1) return;
    const nextStepName = steps[stepIndex + 1];

    //console.log('step viejo:', newStep);
    //await updateSolicitudEstado(newStep, stepIndex);
    //console.log('Updated step nuevo:', newStep);

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
      null, // No mostramos toast de éxito en cada paso para no spamear, pero podrías.
      `Error al pasar a estado ${nextStepName}`
    );
  };
  /*
  setSolicitud(prevSolicitud => ({
    ...prevSolicitud,
    estado: newStep,
    estado_nombre: newStep,
    ...incomingData
  }));
  const currentStep = solicitud?.estado_nombre || solicitud?.estado || "Iniciada";
  //setCurrentStep(newStep);
  try {
    const idSolicitudEstado = stepIndex + 2;
    const requestData = { id: solicitudId, idSolicitudServicioEstado: idSolicitudEstado };

    await apiService.updateRequestStateAdmin(requestData);

    // Si es "Revisada", tu código tenía una llamada extra:
    if (newStep === 'Revisada') {
      await apiService.updateRequestReviewed(solicitudId);
    }

    console.log("Guardado en BD exitoso");
  } catch (error) {
    console.error("Error al guardar, revirtiendo...", error);
    // Aquí podrías hacer un rollback si falla, pero por ahora lo dejamos simple.
    alert("Hubo un error al guardar los cambios en el servidor");
  }
}
if (steps[stepIndex + 1] === 'Revisada') {
  const newStep = steps[stepIndex + 1];
  const id = solicitud.id;
  await updateSolicitudEstado(newStep, stepIndex);
  await apiService.updateRequestReviewed(id);
}

if (steps[stepIndex + 1] === 'Presupuestada') {
  console.log('Solicitud: ', mergedSolicitud);
  await updateRequestBudgeted(mergedSolicitud);
}
if (steps[stepIndex + 1] === 'Finalizada') {
  console.log('Solicitud: ', mergedSolicitud);
  await UpdateRequestFinished(mergedSolicitud);
}
};*/

  const handleRollback = (previousState, errorMessage, errorObj = null) => {
    console.log("--- ROLLBACK EXECUTED ---");
    console.error(errorMessage, errorObj);
    setSolicitud(previousState);
    //setCurrentStep(previousState.estado_nombre || previousState.estado);
    //const currentStep = solicitud?.estado_nombre || solicitud?.estado || "Iniciada";
    setToastConfig({
      show: true,
      message: errorMessage,
      variant: 'danger'
    });

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
    
    //const currentStep = solicitud?.estado_nombre || solicitud?.estado || "Iniciada";
    //setCurrentStep('Cancelada');
    const apiWorker = async () => {
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

      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast
          onClose={() => setToastConfig(prev => ({ ...prev, show: false }))}
          show={toastConfig.show}
          delay={5000}
          autohide
          bg={toastConfig.variant}
        >
          <Toast.Header>
            <strong className="me-auto">Sistema</strong>
          </Toast.Header>
          <Toast.Body className={toastConfig.variant === 'danger' ? 'text-white' : ''}>
            {toastConfig.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>

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