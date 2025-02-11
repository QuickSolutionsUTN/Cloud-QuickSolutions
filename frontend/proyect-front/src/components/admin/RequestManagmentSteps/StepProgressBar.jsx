import React from "react";
import "./StepProgressBar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'  

const StepProgressBar = ({ currentStep }) => {
  const steps = ["Iniciada", "Revisada", "Presupuestada", "Aprobada", "Finalizada"];
  const stepIndex = steps.indexOf(currentStep);
  const isCanceled = currentStep === "Cancelada";

  return (
    <div className="container text-center mt-4">
      <h4>Progreso: {isCanceled ? "Cancelada" : steps[stepIndex]}</h4>
      {/* Contenedor de la barra de progreso */}
      <div className={`progress-container ${isCanceled ? "cancelada" : ""}`}>
        <div className="progress-line-background"></div>
        <div className="progress-line" style={{ width: `${(stepIndex / (steps.length - 1)) * 80}%` }}></div>
        {steps.map((step, index) => (
          <div key={index} className={`step ${index <= stepIndex ? "active" : ""} ${isCanceled && index === stepIndex ? "cancelada" : ""}`}>
            <div className="circle">
              {isCanceled && index === stepIndex ? "0" : (index === 4 ? <FontAwesomeIcon icon={faCheck} /> : index + 1)}
            </div>
            <p className="step-name">{step}</p>
            <p className={`date ${index <= stepIndex ? "visible" : ""}`}>Fecha</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepProgressBar;
