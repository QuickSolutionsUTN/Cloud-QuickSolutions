import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useBackendURL } from '../../contexts/BackendURLContext';
import StepProgressBar from './RequestManagmentSteps/StepProgressBar.jsx';
import StartedStep from './RequestManagmentSteps/StartedStep.jsx';
import ReviewedStep from './RequestManagmentSteps/ReviewedStep.jsx';
import BudgetedStep from './RequestManagmentSteps/BudgetedStep.jsx';
import ApprovedStep from './RequestManagmentSteps/ApprovedStep.jsx';
import FinishedStep from './RequestManagmentSteps/FinishedStep.jsx';
import CancelModalForm from './RequestManagmentSteps/cancelModalForm.jsx';
import apiService from '../../services/axiosConfig.jsx';
import { Button } from 'react-bootstrap';

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
      const requestData = {id: solicitudId, idSolicitudServicioEstado: stepIndex + 2};
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

  const updateSolicitudPresupuesto=async()=>{
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

  const nextStep = async () => {
    console.log('Next step');
    const stepIndex = steps.indexOf(currentStep);
    console.log('stepIndex:', stepIndex);
    if (stepIndex < steps.length - 1 && steps[stepIndex + 1]!=='Presupuestada') {
      const newStep = steps[stepIndex + 1];
      console.log('step viejo:', newStep);
      await updateSolicitudEstado(newStep, stepIndex);
      console.log('Updated step nuevo:', newStep);
    }
    if (steps[stepIndex + 1]==='Presupuestada'){
      console.log('Solicitud: ', solicitud);
      await updateSolicitudPresupuesto();
    }
  };

  const subcontractStep = async () => {
    console.log('Subcontratar');
  };

  const cancelStep = () => {
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
        return <StartedStep nextStep={nextStep} subcontractStep={subcontractStep} cancelStep={cancelStep} />;
      case 'Revisada':
        return <ReviewedStep solicitud={solicitud} nextStep={nextStep} cancelStep={cancelStep} handleChange={handleChange} />;
      case 'Presupuestada':
        return <BudgetedStep />;
      case 'Aprobada':
        return <ApprovedStep nextStep={nextStep} cancelStep={cancelStep} />;
      case 'Finalizada':
        return <FinishedStep />;
      default:
        return <div>Error al obtener el estado</div>;
    }
  };

  return (
    <div className='requestManagement'>
      <div className='back-button'>
        <Button 
          variant="outline-dark" 
          style={{ position: 'absolute', marginTop: '1%', marginLeft: '1%' }}
          onClick={() => navigate('/admin/requests')}
        >
          Volver
        </Button>
      </div>
      <div className='tittle'>
        <h2>Gestión de solicitud #{solicitudId}</h2>
      </div>
      <StepProgressBar currentStep={currentStep} />
      {renderContent()}
      <CancelModalForm show={showCancelModalForm} onClose={handleCloseCancelModalForm} />
    </div>
  );
}

export default RequestManagement;