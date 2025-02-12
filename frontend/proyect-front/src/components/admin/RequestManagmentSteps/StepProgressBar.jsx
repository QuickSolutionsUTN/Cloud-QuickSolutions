import React from "react";
import "./StepProgressBar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'  

const StepProgressBar = ({ currentStep }) => {
  const steps = ["Iniciada", "Revisada", "Presupuestada", "Aprobada", "Finalizada", "Cancelada"];
  const stepIndex = steps.indexOf(currentStep);

  return (
    <div className="container text-center mt-4">
      <h4>Progreso: {steps[stepIndex]}</h4>
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
            <p className={`date ${index <= stepIndex ? "visible" : ""}`}>Fecha</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepProgressBar;