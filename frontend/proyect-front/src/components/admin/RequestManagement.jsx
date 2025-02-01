import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useBackendURL } from '../../contexts/BackendURLContext';
import { Form, Button } from 'react-bootstrap';
import StepProgressBar from './RequestManagmentSteps/StepProgressBar.jsx';
import StartedStep from './RequestManagmentSteps/StartedStep.jsx';
import ProductReviewedStep from './RequestManagmentSteps/ProductReviewedStep.jsx';
import BudgetedStep from './RequestManagmentSteps/BudgetedStep.jsx';
import ApprovedStep from './RequestManagmentSteps/ApprovedStep.jsx';
import FinishedStep from './RequestManagmentSteps/FinishedStep.jsx';


function RequestManagement (){
    const [solicitud, setSolicitud] = useState(null);
    const { id: solicitudId } = useParams();
    const backendURL = useBackendURL();
    const [fechaFormateada, setFechaFormateada] = useState('');
    const navigate = useNavigate();
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
      }, [solicitudId, backendURL]);

      
    
      if (!solicitud) {
        return <div>Cargando...</div>;
      }

      const renderContent = () => {
        switch (data.estado) {
          case 'Iniciada':
            return <StartedStep />;
          case 'ProductoRevisado':
            return <ProductReviewedStep />;
          case 'Presupuestada':
            return <BudgetedStep />;
          case 'Aprobada':
            return <ApprovedStep />;
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
          <StepProgressBar currentStep={data.estado} onStepChange={actualizarEstado} />
          {renderContent()}
        </div>
      );
    }
    
    export default RequestManagement;
