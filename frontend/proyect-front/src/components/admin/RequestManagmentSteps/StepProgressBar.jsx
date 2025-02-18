import React from "react";
import "./StepProgressBar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'  

const StepProgressBar = ({ currentStep, solicitud }) => {
  const steps = ["Iniciada", "Revisada", "Presupuestada", "Aprobada", "Finalizada"];
  const stepIndex = steps.indexOf(currentStep);
  
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="container text-center mt-4">
      <h4>Progreso: {currentStep === "Cancelada" ? "Cancelada" : steps[stepIndex]}</h4>
      {/* Contenedor de la barra de progreso */}
      <div className="progress-container">
        <div className="progress-line-background"></div>
        <div className="progress-line" style={{ width: `${(stepIndex / (steps.length - 1)) * 80}%` }}></div>
        {steps.map((step, index) => (
          <div key={index} className={`step ${index <= stepIndex ? "active" : ""}`}>
            <div className="circle">
              {index === 4 ? <FontAwesomeIcon icon={faCheck} /> : index + 1}
            </div>
            <p className="step-name">{step}</p>
            <p className={`date ${index <= stepIndex ? "visible" : ""}`}>
              {step === "Iniciada" && solicitud.fechaGeneracion && formatDateTime(solicitud.fechaGeneracion)}
              {step === "Revisada" && solicitud.fechaRevisada && formatDateTime(solicitud.fechaRevisada)}
              {step === "Presupuestada" && solicitud.fechaPresupuestada && formatDateTime(solicitud.fechaPresupuestada)}
              {step === "Aprobada" && solicitud.fechaAprobada && formatDateTime(solicitud.fechaAprobada)}
              {step === "Finalizada" && solicitud.fechaFinalizada && formatDateTime(solicitud.fechaFinalizada)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepProgressBar;