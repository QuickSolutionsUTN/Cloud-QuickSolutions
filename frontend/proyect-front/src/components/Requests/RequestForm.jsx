import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ProgressBar, Button } from 'react-bootstrap';
import StepForm from './StepForm.jsx';
import { useBackendURL } from '../../contexts/BackendURLContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../../contexts/AuthContext.jsx';
import apiService from '../../services/axiosConfig';
import StepLogistics from './StepsRequestForm/Step3_Logistics.jsx';
import './requestForm.css';

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
  const [requestId, setRequestId] = useState(0);

  const [formData, setFormData] = useState({
    productData: { serviceId: 0, categoryId: 0, productTypeId: 0, maintenanceTypeId: 0, problemDescription: '' },
    personalData: { email: '', firstName: '', lastName: '' },
    logisticsData: { conLogistica: false, street: '', number: '', cityId: '', stateId: '', zipCode: '', country: '' },
  });

  const { control, setValue, watch, formState: { isValid, errors } } = useForm({
    mode: 'onChange', // Actualización en tiempo real
    defaultValues: {
      productData: { serviceId: 0, categoryId: 0, productTypeId: 0, maintenanceTypeId: 0, problemDescription: '' },
      personalData: { email: '', firstName: '', lastName: '' },
      logisticsData: { conLogistica: false, street: '', number: '', floor: '', apartment: '', cityId: '', stateId: '', zipCode: '' },
    }
  });

  // Para ver los valores en tiempo real
  useEffect(() => {
    const subscription = watch((values) => {
      console.log("Valores actuales del formulario:", values);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

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
    const envioData = watch('logisticsData');
    if (envioData.conLogistica) {data.logisticsData.conLogistica = true;}

    const DataToSend = {
      userEmail: data.personalData.userEmail,
      descripcion: data.productData.problemDescription,
      idTipoServicio: parseInt(data.productData.serviceId, 10),
      idTipoProducto: parseInt(data.productData.productTypeId, 10),
      conLogistica: data.logisticsData.conLogistica,
    };

    if (envioData.conLogistica) {
      DataToSend.envio = {
      calle: envioData.street,
      numero: envioData.number,
      piso:envioData?.floor || 0,
      departamento: envioData.apartment,
      idLocalidad: parseInt(envioData.cityId, 10),
    }
  }else { DataToSend.envio = null;
}
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
  //console.log("current Data", formData);
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
    const currentData = watch('logisticsData');
    if (currentData.conLogistica) { return currentData.street && currentData.number && currentData.cityId && currentData.zipCode && currentData.stateId; }
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
    <div className="mt-5">
      {currentStep !== 2 && <StepForm
        step={steps[currentStep]}
        formData={formData[steps[currentStep].section]}
        updateData={(newData) => updateData(steps[currentStep].section, newData)}
        setIsStepComplete={setStepComplete}
      />}
      {currentStep === 2 && <StepLogistics formData={watch()} control={control} errors={errors} />}
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