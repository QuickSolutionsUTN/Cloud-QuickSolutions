import React, { useState } from 'react';
import { ProgressBar, Button } from 'react-bootstrap';
import StepForm from './StepForm.jsx';
import { useBackendURL } from '../../contexts/BackendURLContext.jsx';
import axios from 'axios';
import './requestForm.css';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../../contexts/AuthContext.jsx';
import apiService from '../../services/axiosConfig';

const steps = [
  { id: 1, name: 'Datos del Producto', section: 'productData' },
  { id: 2, name: 'Datos Personales', section: 'personalData' },
  { id: 3, name: 'Envio', section: 'logisticsData' },
  { id: 4, name: 'Confirmacion', section: 'confirmation' },
];

export const RequestForm = () => {
  const backendURL = useBackendURL();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const { isAuthenticated, userEmail } = useContext(AuthContext);
  const [stepComplete, setStepComplete] = useState(false);
  const [requestId,setRequestId] = useState(0);
  const [formData, setFormData] = useState({
    productData: { serviceId: 0, categoryId: 0, productTypeId: 0, maintenanceTypeId: 0, problemDescription: '' },
    personalData: { email: '', firstName: '', lastName: '' },
    logisticsData: { conLogistica: false, street: '', number: '', city: '', state: '', zipCode: '', country: '' },
  });

  // Function to update the data of each step
  const updateData = (section, newData) => {
    console.log(`Updating section ${section} with data:`, newData);
    setFormData((prevData) => ({
      ...prevData,
      [section]: { ...prevData[section], ...newData }
    }));
  };

  const handleSubmit = async (data) => {
    console.log("Enviando formulario:", data);
    const DataToSend = {
      userEmail: data.personalData.userEmail,
      descripcion: data.productData.problemDescription,
      idTipoServicio: parseInt(data.productData.serviceId, 10),
      idCategoria: parseInt(data.productData.categoryId, 10),
      idTipoProducto: parseInt(data.productData.productTypeId, 10),
      conLogistica: data.logisticsData.conLogistica,
    };

    if (data.conLogistica) {
      DataToSend.envio = {
      calle: data.logisticsData.street,
      numero: data.logisticsData.number,
      ciudad: data.logisticsData.city,
      provincia: data.logisticsData.state,
      codigoPostal: data.logisticsData.zipCode,
      pais: 'Argentina'
    }}else{DataToSend.envio = null;}
    console.log("Formulario completado", DataToSend);
    createRequest(DataToSend);
  };


  const createRequest = async (data) => {
    try {
      const response = await apiService.createRequest(data);
      handleServerResponse(response);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  const handleServerResponse = (response) => {
    if (response.status === 201) {
      console.log("Formulario enviado correctamente");
      console.log("Respuesta del servidor", response.data);
      navigate(`/users/requests/${response.data.id}`);
    } else {
      console.error("Error al enviar el formulario:", response);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
    } else {
      handleSubmit(formData);
    }
  };

  const isStepComplete = () => {
    const currentData = formData[steps[currentStep].section];
    if (currentStep === 0) {
      return currentData.serviceId && currentData.categoryId && currentData.productTypeId && (currentData.problemDescription || currentData.maintenanceTypeId);
    } else if (currentStep === 1) {
      return isAuthenticated;
    } else if (currentStep === 2) {
      if (currentData.conLogistica) { return currentData.street && currentData.number && currentData.city && currentData.zipCode && currentData.state; }
      else { return true; }
    } else if (currentStep === 3) { return true; }
  };

  const previousStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  return (
    <div className="container mt-4">
      <div className="steps-title-container">
        <div className={`step ${currentStep >= 0 ? 'active' : 'inactive'}`}> <b>1. {steps[0].name}</b></div>
        <div className={`step ${currentStep >= 1 ? 'active' : 'inactive'}`}> <b>2. {steps[1].name}</b></div>
        <div className={`step ${currentStep >= 2 ? 'active' : 'inactive'}`}> <b>3. {steps[2].name}</b></div>
        <div className={`step ${currentStep >= 3 ? 'active' : 'inactive'}`}> <b>4. {steps[3].name}</b></div>
      </div>
      <ProgressBar now={(currentStep + 1) * (100 / steps.length)} className='custom-progress' />
      <div className="mt-4">
        <StepForm
          step={steps[currentStep]}
          formData={formData[steps[currentStep].section]}
          updateData={(newData) => updateData(steps[currentStep].section, newData)}
          setIsStepComplete={setStepComplete}
        />
      </div>
      <div className="mt-4 mb-3 container-buttons">
        <Button
          variant="secondary"
          onClick={previousStep}
          disabled={currentStep === 0}
        >
          Anterior
        </Button>
        <Button
          className='next-button'
          variant="primary"
          onClick={nextStep}
          disabled={!isStepComplete()}
        >
          {currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
        </Button>
      </div>
    </div>
  );
}

export default RequestForm;