import React, { useState } from 'react';
import { ProgressBar, Button } from 'react-bootstrap';
import StepForm from './StepForm.jsx';

import './RequestForm.css';

const steps = [
  { id: 1, name: 'Datos del Producto', section: 'productData' },
  { id: 2, name: 'Datos Personales', section: 'personalData' },
  { id: 3, name: 'Hecho', section: 'confirmation' },
];

export const RequestForm = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    productData: { categoryId: '', productTypeId: '', problemDescription: '' },
    personalData: { email: '', firstName: '', lastName: '' },
  });

  // Function to update the data of each step
  const updateData = (section, newData) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: { ...prevData[section], ...newData }
    }));
  };

  const nextStep = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
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
      <ProgressBar now={(currentStep + 1) * (100 / steps.length)} className='.custom-progress ' />
      <div className="mt-4">
        <StepForm
          step={steps[currentStep]}
          formData={formData[steps[currentStep].section]}
          updateData={newData =>
            setFormData(prevData => ({
              ...prevData,
              [steps[currentStep].section]: {
                ...prevData[steps[currentStep].section],
                ...newData,
              },
            }))
          }
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
          disabled={currentStep === steps.length - 1}
        >
          {currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
        </Button>
      </div>
    </div>
  );
}

export default RequestForm;