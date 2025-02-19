import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Accordion } from 'react-bootstrap';
import axios from 'axios';
import { useBackendURL } from '../../contexts/BackendURLContext';
import StepProgressBar from './RequestManagmentSteps/StepProgressBar.jsx';
import StartedStep from './RequestManagmentSteps/StartedStep.jsx';
import ReviewedStep from './RequestManagmentSteps/ReviewedStep.jsx';
import BudgetedStep from './RequestManagmentSteps/BudgetedStep.jsx';
import ApprovedStep from './RequestManagmentSteps/ApprovedStep.jsx';
import FinishedStep from './RequestManagmentSteps/FinishedStep.jsx';
import CancelModalForm from './RequestManagmentSteps/CancelModalForm.jsx';
import apiService from '../../services/axiosConfig.jsx';
import apiReparacionExterna from '../../services/apiBolsaTrabajoService.jsx';

import { Button } from 'react-bootstrap';
import './RequestManagement.css';
import CancelStep from './RequestManagmentSteps/CancelStep.jsx';

function RequestManagement() {
  const [solicitud, setSolicitud] = useState(null);
  const { id: solicitudId } = useParams();
  const backendURL = useBackendURL();
  const [fechaFormateada, setFechaFormateada] = useState('');
  const navigate = useNavigate();
  const steps = ["Iniciada", "Revisada", "Presupuestada", "Aprobada", "Finalizada"];
  const [currentStep, setCurrentStep] = useState("Iniciada");
  const [showCancelModalForm, setShowCancelModalForm] = useState(false);

  useEffect(() => {
    const fetchSolicitudDetails = async () => {
      try {
        console.log('Fetching solicitud details...');
        const response = await axios.get(`${backendURL}/api/solicitud/${solicitudId}`);
        console.log('Solicitud details:', response.data);
        setSolicitud(response.data);
        setCurrentStep(response.data.estado);
        const fechaGeneracion = new Date(response.data.fechaGeneracion);
        const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
        setFechaFormateada(fechaGeneracion.toLocaleDateString('es-ES', opciones));
      } catch (error) {
        console.error('Error fetching solicitud details:', error);
      }
    }
    fetchSolicitudDetails();
  }, [solicitudId, backendURL]);

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
  const updateSolicitudEnvio = async (solicitud) => {
    try {
      console.log('Updating request deliver...');
      await apiService.updateRequestDeliverAdmin(solicitud.id, solicitud.envio);
      console.log('Updated request deliver');
    } catch (error) {
      console.error('Error updating request state:', error);
    }
  };

  const updateRequestBudgeted = async () => {
    try {
      const stepIndex = steps.indexOf(currentStep);
      const newStep = steps[stepIndex + 1];
      console.log('Updating request state...', solicitud);
      const requestData = {
        id: solicitudId,
        diagnosticoTecnico: solicitud.diagnosticoTecnico,
        idSolicitudServicioEstado: stepIndex + 2,
        monto: solicitud.monto,
        fechaEstimada: solicitud.fechaEstimada
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
        resumen: solicitud.Resumen,
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
    if (stepIndex < steps.length - 1 && steps[stepIndex + 1] !== 'Presupuestada' && steps[stepIndex + 1] !== 'Revisada') {
      const newStep = steps[stepIndex + 1];
      console.log('step viejo:', newStep);
      await updateSolicitudEstado(newStep, stepIndex);
      console.log('Updated step nuevo:', newStep);
    }
    if (steps[stepIndex + 1] === 'Revisada') {
      const newStep = steps[stepIndex + 1];
      const id = solicitud.id;
      console.log('step viejo:', newStep);
      console.log('Solicitud: ', solicitud);
      if (solicitud.conLogistica) await updateSolicitudEnvio(solicitud);
      await updateSolicitudEstado(newStep, stepIndex);
      await apiService.updateRequestReviewed(id);
      console.log('Updated step nuevo:', newStep);
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

  const handleSubcontractStep = async () => {
    const newStep = steps[stepIndex + 1];
    const requestData = {
      id: solicitud.id,
      idSolicitudServicioEstado: 2,
      tercearizado: true,
      idEmpresa: 1,
      IdSolicitudExterna: solicitud.IdSolicitudExterna,
    };

    console.log('data to send:', requestData);

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


  const handleCancelButton = () => {
    setShowCancelModalForm(true);
  };

  const handleCloseCancelModalForm = () => {
    setShowCancelModalForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('handleChange:', name, value);
    setSolicitud((prevSolicitud) => ({
      ...prevSolicitud,
      [name]: value,
    }));
  };

  if (!solicitud) {
    return <div>Cargando...</div>;
  }

  const renderContent = () => {
    switch (solicitud.estado) {
      case 'Iniciada':
        return <StartedStep solicitud={solicitud} nextStep={nextStep} subcontractStep={handleSubcontractStep} cancelStep={handleCancelButton} />;
      case 'Revisada':
        return <ReviewedStep solicitud={solicitud} nextStep={nextStep} cancelStep={handleCancelButton} handleChange={handleChange} />;
      case 'Presupuestada':
        return <BudgetedStep />;
      case 'Aprobada':
        return <ApprovedStep solicitud={solicitud} nextStep={nextStep} cancelStep={handleCancelButton} handleChange={handleChange} />;
      case 'Finalizada':
        return <FinishedStep />;
      case 'Cancelada':
        return <CancelStep solicitud={solicitud}/>;
      default:
        return <div>Error al obtener el estado</div>;
    }
  };

  return (
    <div className='requestManagement'>
      <div className='requestManagement-header'>
        <div className='d-flex align-items-center justify-content-between mb-3'>
          <Button
            variant="outline-dark"
            onClick={() => navigate('/admin/requests')}
          >
            Volver
          </Button>
        </div>
        <div className='d-flex align-items-center justify-content-center p-2'>
          <div className='text-center'>
            <h3>Gestión de solicitud #{solicitudId}</h3>
            <div className='align-items-center'>
              <p style={{ color: 'gray' }}>Generada: {fechaFormateada} {new Date(solicitud.fechaGeneracion).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </div>
      </div>
      <StepProgressBar solicitud={solicitud} currentStep={currentStep} />
      <div className='d-flex request-details p-3'>
        <div className='flex-grow-1'>
          {renderContent()}
        </div>
        <div className='aside-details'>
          <div className="user-details ms-3 p-3 border rounded shadow-sm bg-light mb-2">
            <div className="d-flex flex-column">
              <span className="mb-2 fw-bold">Usuario</span>
              <span>{solicitud.emailSolicitante}</span>
            </div>
          </div>
          <div className="user-details ms-3 p-3 border rounded shadow-sm bg-light mb-2">
            <div className="d-flex flex-column">
              <span className="mb-2 "><b>Logistica:</b>
                <span className='ms-2'></span>{solicitud.conLogistica ? 'Si' : 'No'}
              </span>
              <span className="mb-2">Nro seguimiento:<span className='ms-2'></span>{solicitud.envio ? solicitud.envio.nroSeguimiento : '-'}</span>
            </div>
          </div>
          <div className="user-details ms-3 p-3 border rounded shadow-sm bg-light mb-2">
            <div className="d-flex flex-column">
              <span className="mb-2 "><b>SubContratada:</b>
                <span className='ms-2'></span>{solicitud.tercearizado ? 'Si' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <CancelModalForm show={showCancelModalForm} onClose={handleCloseCancelModalForm} />
    </div>
  );
}

export default RequestManagement;