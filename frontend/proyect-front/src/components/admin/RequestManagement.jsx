import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Modal } from 'react-bootstrap';
import StepProgressBar from './RequestManagmentSteps/StepProgressBar.jsx';
import StartedStep from './RequestManagmentSteps/StartedStep.jsx';
import ReviewedStep from './RequestManagmentSteps/ReviewedStep.jsx';
import BudgetedStep from './RequestManagmentSteps/BudgetedStep.jsx';
import ApprovedStep from './RequestManagmentSteps/ApprovedStep.jsx';
import FinishedStep from './RequestManagmentSteps/FinishedStep.jsx';
import CancelStep from './RequestManagmentSteps/CancelStep.jsx';
import CancelModalForm from './RequestManagmentSteps/CancelModalForm.jsx';
import apiService from '../../services/axiosConfig.jsx';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddressCard from '../users/UserAddressCard.jsx';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './RequestManagement.css';
import DescriptionCard from './RequestManagmentSteps/DescriptionCard.jsx';
import BudgetCard from './RequestManagmentSteps/BudgetCard.jsx';
import DiagnosisCard from './RequestManagmentSteps/DiagnosisCard.jsx';

function RequestManagement() {
  const [solicitud, setSolicitud] = useState(null);
  const { id: solicitudId } = useParams();
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
    return (
      <div className='requestManagement w-100 p-4'>
        <div className="d-flex justify-content-between mb-4">
          <div className="skeleton skeleton-title" style={{ width: '80px' }}></div>
          <div className="skeleton skeleton-title"></div>
          <div style={{ width: '80px' }}></div>
        </div>

        <div className="skeleton skeleton-box mb-5" style={{ height: '60px', borderRadius: '30px' }}></div>

        <div className="d-flex gap-3 mb-4">
          <div className="skeleton skeleton-box flex-fill"></div>
          <div className="skeleton skeleton-box flex-fill"></div>
          <div className="skeleton skeleton-box flex-fill"></div>
        </div>

        <div className="skeleton skeleton-box" style={{ height: '300px' }}></div>
      </div>
    );
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

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  };

  return (
    <div className='requestManagement w-100 p-3'>
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

      <hr style={{ borderTop: '1px solid lightgray', margin: '1%' }} />

      <div className='info-card'>
        <div className="row mx-0 w-100 align-items-center py-1">
          <div className="col-md-3 mb-2 ribbon-item">
            <div className="section-label">Usuario</div>
            <div className="data-value">
              <FontAwesomeIcon icon={faUser} className="me-2 text-primary" />
              <span className="text-truncate" title={solicitud.emailSolicitante}>
                {solicitud.emailSolicitante}
              </span>
            </div>
          </div>

          <div className="col-md-2 mb-2 ribbon-item">
            <div className="section-label">Servicio</div>
            <div className="data-value">
              {solicitud.tipoServicio}
              {solicitud.mantenimiento && <span className="text-muted"> ({solicitud.mantenimiento.nombre})</span>}
            </div>
          </div>

          <div className='col-md-2 mb-2 ribbon-item'>
            <div className="section-label">Categoría</div>
            <div className="data-value fs-6">{solicitud.categoria}</div>
          </div>

          <div className='col-md-2 mb-2 ribbon-item'>
            <div className="section-label">Producto</div>
            <div className="data-value fs-6">{solicitud.producto}</div>
          </div>

          <div className="col-md-3 mb-2 ribbon-item">
            <div className="section-label">Logística</div>
            <div className="data-value">
              {solicitud.con_logistica ? (
                <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                  A domicilio
                </span>
              ) : (
                <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-10 rounded-pill px-3">
                  En taller
                </span>
              )}
            </div>
            {solicitud.con_logistica ? (
              <button className="btn btn-link btn-sm p-0 text-decoration-none" onClick={async () => {
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
            ) : null}
          </div>
        </div>
      </div>

      <div className="d-flex description-technical-section mb-4">
        <div className="row w-100 gx-3">
          <div className="col-6 d-flex flex-column" >
            <div className="section-label mb-2">Descripción del problema / mantenimiento</div>
            <DescriptionCard text={solicitud.descripcion || solicitud.mantenimiento?.descripcion} />
          </div>
          <div className="col-6 d-flex flex-column">
            <div className="section-label mb-2">Detalles del Presupuesto</div>
            <BudgetCard
              fecha={currentStep !== "Revisada" ? solicitud.fechaEstimada : ''}
              monto={currentStep !== "Revisada" ? solicitud.monto : ''}
            />
          </div>
        </div>
      </div>
      {solicitud.diagnosticoTecnico && currentStep !== "Revisada" && (
        <div className="d-flex diagnosis-section mb-4">
          <div className="flex-grow-1">
            <div className="col-12" >
              <div className="section-label mb-2">Diagnóstico Técnico</div>
              <DiagnosisCard text={solicitud.diagnosticoTecnico} />
            </div>
          </div>
        </div>
      )}
      <div className='d-flex request-details mb-4'>
        <div className='flex-grow-1'>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
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