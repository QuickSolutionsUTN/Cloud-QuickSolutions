import React from "react";
import "./StepProgressBar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'  

const StepProgressBar = ({ currentStep, solicitud }) => {
  const steps = ["Iniciada", "Revisada", "Presupuestada", "Aprobada", "Finalizada"];
  const stepIndex = steps.indexOf(currentStep);
  
  const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString();
  };

  const formatTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="admin-progress-bar container text-center mt-4">
     {/*  <h4>Progreso: {currentStep === "Cancelada" ? "Cancelada" : steps[stepIndex]}</h4>*/}
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
              {step === "Iniciada" && solicitud.fechaIniciada && formatDate(solicitud.fechaIniciada)}
              {step === "Revisada" && solicitud.fechaRevisada && formatDate(solicitud.fechaRevisada)}
              {step === "Presupuestada" && solicitud.fechaPresupuestada && formatDate(solicitud.fechaPresupuestada)}
              {step === "Aprobada" && solicitud.fechaAprobada && formatDate(solicitud.fechaAprobada)}
              {step === "Finalizada" && solicitud.fechaFinalizada && formatDate(solicitud.fechaFinalizada)}
            </p>
            <p className={`time ${index <= stepIndex ? "visible" : ""}`}>
              {step === "Iniciada" && solicitud.fechaIniciada && formatTime(solicitud.fechaIniciada)}
              {step === "Revisada" && solicitud.fechaRevisada && formatTime(solicitud.fechaRevisada)}
              {step === "Presupuestada" && solicitud.fechaPresupuestada && formatTime(solicitud.fechaPresupuestada)}
              {step === "Aprobada" && solicitud.fechaAprobada && formatTime(solicitud.fechaAprobada)}
              {step === "Finalizada" && solicitud.fechaFinalizada && formatTime(solicitud.fechaFinalizada)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepProgressBar;