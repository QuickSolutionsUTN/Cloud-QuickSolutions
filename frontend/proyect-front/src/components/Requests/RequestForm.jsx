import React, { useState } from 'react';
import { ProgressBar, Button } from 'react-bootstrap';
import StepForm from './StepForm.jsx';
import { useBackendURL } from '../../contexts/BackendURLContext.jsx';
import axios from 'axios';
import './requestForm.css';
import { useNavigate } from 'react-router-dom';

const steps = [
  { id: 1, name: 'Datos del Producto', section: 'productData' },
  { id: 2, name: 'Datos Personales', section: 'personalData' },
  { id: 3, name: 'Confirmacion', section: 'confirmation' },
];

export const RequestForm = () => {
  const backendURL = useBackendURL();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    productData: { serviceId: 0, categoryId: 0, productTypeId: 0, problemDescription: '' },
    personalData: { email: '', firstName: '', lastName: '' },
  });

  // Function to update the data of each step
  const updateData = (section, newData) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: { ...prevData[section], ...newData }
    }));
  };

  const handleSubmit = async (data) => {
    const DataToSend={
      userEmail: data.personalData.email,
      descripcion: data.productData.problemDescription,
      idTipoServicio: parseInt(data.productData.serviceId,10),
      idCategoria: parseInt(data.productData.categoryId,10),
      idTipoProducto: parseInt(data.productData.productTypeId,10),
    };

    try {
      console.log("Formulario completado", DataToSend);

      const response = await axios.post(`${backendURL}/solicitud`, DataToSend);

      if (response.status=201) {
        const solicitudId = response.data.id;
        console.log("Formulario enviado correctamente");
        console.log("Respuesta del servidor", response.data);
        navigate(`/requests/${solicitudId}`);
      } else {
        console.log("Error al enviar el formulario", response.data);
      }
    } catch (error) {
      console.error("Error al enviar el formulario", error);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
    } else {
      handleSubmit(formData);
    }
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
      </div>
      <ProgressBar now={(currentStep + 1) * (100 / steps.length)} className='custom-progress' />
      <div className="mt-4">
        <StepForm
          step={steps[currentStep]}
          formData={formData[steps[currentStep].section]}
          updateData={(newData) => updateData(steps[currentStep].section, newData)}
        />
      </div>
      <div className="mt-4 container-buttons">
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
        >
          {currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
        </Button>
      </div>
    </div>
  );
}

export default RequestForm;
//disabled={currentStep === steps.length - 1}