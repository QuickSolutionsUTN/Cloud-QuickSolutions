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
import { Button } from 'react-bootstrap';

function RequestManagement() {
  const [solicitud, setSolicitud] = useState(null);
  const { id: solicitudId } = useParams();
  const backendURL = useBackendURL();
  const [fechaFormateada, setFechaFormateada] = useState('');
  const navigate = useNavigate();
  const steps = ["Iniciada", "Revisada", "Presupuestada", "Aprobado", "Finalizado"];
  const [currentStep, setCurrentStep] = useState("Iniciada");

  useEffect(() => {
    const fetchSolicitudDetails = async () => {
      try {
        console.log('Fetching solicitud details...', backendURL);
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

  const nextStep = async () => {
    console.log('Next step');
    const stepIndex = steps.indexOf(currentStep);
    if (stepIndex < steps.length - 1) {
      const newStep = steps[stepIndex + 1];
      try {
        await axios.put(`${backendURL}/api/solicitud/actualizar-estado`, {
          id: solicitudId,
          idSolicitudServicioEstado: stepIndex + 2
        });
        setCurrentStep(newStep);
        setSolicitud(prevSolicitud => ({
          ...prevSolicitud,
          estado: newStep
        }));console.log('Updated currentStep:', newStep);
        console.log('Updated solicitud:', {
          ...solicitud,
          estado: newStep
        });
      } catch (error) {
        console.error('Error updating request state:', error);
      }
    }
  };

  const prevStep = () => {
    const stepIndex = steps.indexOf(currentStep);
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1]);
    }
  };

const subcontractStep = async () => {
  console.log('Subcontratar');
};

  const cancelStep = () => {
    setCurrentStep("Cancelada");
  };

  if (!solicitud) {
    return <div>Cargando...</div>;
  }

  const renderContent = () => {
    switch (solicitud.estado) {
      case 'Iniciada':
        return <StartedStep nextStep={nextStep} subcontractStep={subcontractStep} cancelStep={cancelStep}/>;
      case 'Revisada':
        return <ReviewedStep nextStep={nextStep} cancelStep={cancelStep}/>;
      case 'Presupuestada':
        return <BudgetedStep nextStep={nextStep} cancelStep={cancelStep}/>;
      case 'Aprobada':
        return <ApprovedStep nextStep={nextStep} cancelStep={cancelStep}/>;
      case 'Finalizada':
        return <FinishedStep />;
      default:
        return <div>Error al obtener el estado</div>;
    }
  };

  return (
    <div className='requestManagement'>
      <div className='tittle'>
        <h2>Gestión de solicitud #{solicitudId}</h2>
      </div>
      <StepProgressBar currentStep={currentStep} />
      {renderContent()}
    </div>
  );
}

export default RequestManagement;