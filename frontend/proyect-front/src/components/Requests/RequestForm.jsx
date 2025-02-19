import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ProgressBar, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../../contexts/AuthContext.jsx';
import apiService from '../../services/axiosConfig';
import StepLogistics from './StepsRequestForm/Step3_Logistics.jsx';
import StepProductData from './StepsRequestForm/Step1_ProductData.jsx';
import StepPersonalData from './StepsRequestForm/Step2_PersonalData.jsx';
import FormSummary from './StepsRequestForm/FormSummary.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './requestForm.css';

const steps = [
  { id: 1, name: 'Datos del Producto', section: 'productData' },
  { id: 2, name: 'Datos Personales', section: 'personalData' },
  { id: 3, name: 'Envio', section: 'logisticsData' },
  { id: 4, name: 'Confirmacion', section: 'confirmation' },
];

export const RequestForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const { isAuthenticated, userEmail } = useContext(AuthContext);
  const [stepComplete, setStepComplete] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const { control, setValue, watch, formState: { isValid, errors } } = useForm({
    mode: 'onChange',
    defaultValues: {
      productData: { serviceId: 0, categoryId: 0, productTypeId: 0, maintenanceTypeId: 0, problemDescription: '' },
      personalData: { email: '', firstName: '', lastName: '' },
      logisticsData: { conLogistica: false, street: '', number: '', floor: '', apartment: '', cityId: '', stateId: '', zipCode: '' },
    }
  });

  useEffect(() => {
    console.log("Se inicia formulario:");
    const serviceType = queryParams.get('type');
    if (serviceType === 'repair') { setValue('productData.serviceId', 1); }
    if (serviceType === 'maintenance') { setValue('productData.serviceId', 2); }
  }, []);

  const handleSubmit = async (data) => {
    console.log("Enviando formulario:", data);
    const envioData = data.logisticsData;
    if (envioData.conLogistica) { data.logisticsData.conLogistica = true; }

    const DataToSend = {
      userEmail: data.personalData.email,
      descripcion: data.productData.problemDescription,
      idTipoServicio: parseInt(data.productData.serviceId, 10),
      idTipoProducto: parseInt(data.productData.productTypeId, 10),
      conLogistica: data.logisticsData.conLogistica,
    };
    if (envioData.conLogistica) {
      DataToSend.envio = {
        calle: envioData.street,
        numero: envioData.number,
        piso: envioData?.floor || 0,
        departamento: envioData.apartment,
        idLocalidad: parseInt(envioData.cityId, 10),
      }
    } else {
      DataToSend.envio = null;
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
    if (currentStep < steps.length - 1) {
      setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
    } else {
      const formData = watch();
      handleSubmit(formData);
    }
  };

  const isStepComplete = () => {
    const currentData = watch();
    if (currentStep === 0) {
      return currentData.productData.serviceId &&
        currentData.productData.categoryId &&
        currentData.productData.productTypeId &&
        (currentData.productData.problemDescription || currentData.productData.maintenanceTypeId);
    }
    else if (currentStep === 1) { return isAuthenticated; }
    else if (currentStep === 2) {
      if (currentData.logisticsData.conLogistica) {
        return currentData.logisticsData.street &&
          currentData.logisticsData.number &&
          currentData.logisticsData.cityId &&
          currentData.logisticsData.zipCode &&
          currentData.logisticsData.stateId;
      } else { return true; }
    }
    else if (currentStep === 3) { return true; }
  };

  const previousStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  return (
    <div className="main-content container mt-4">
      <div className="steps-title d-flex justify-content-between align-items-center p-3">
        <div className={`step ${currentStep >= 0 ? 'active' : 'inactive'}`}> <b>1. {steps[0].name}</b></div>
        <div className={`step ${currentStep >= 1 ? 'active' : 'inactive'}`}> <b>2. {steps[1].name}</b></div>
        <div className={`step ${currentStep >= 2 ? 'active' : 'inactive'}`}> <b>3. {steps[2].name}</b></div>
        <div className={`step ${currentStep >= 3 ? 'active' : 'inactive'}`}> <b>4. {steps[3].name}</b></div>
      </div>
      <ProgressBar now={(currentStep + 1) * (100 / steps.length)} />
      <div className="form-data mt-4">
        {currentStep === 0 && <StepProductData formData={watch()} control={control} errors={errors} setValue={setValue} />}
        {currentStep === 1 && <StepPersonalData formData={watch()} control={control} errors={errors} setValue={setValue} />}
        {currentStep === 2 && <StepLogistics formData={watch()} control={control} errors={errors} />}
        {currentStep === 3 && <FormSummary formData={watch()} control={control} errors={errors} />}
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