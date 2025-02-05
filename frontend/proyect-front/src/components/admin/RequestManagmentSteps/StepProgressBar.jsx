import React, { useState } from "react";
import { Button } from "react-bootstrap";
import "./StepProgressBar.css";

const StepProgressBar = () => {
    const steps = ["Iniciada", "Presupuestado", "Aprobado", "Finalizado"];
    const [currentStep, setCurrentStep] = useState(0);

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="container text-center mt-4">
            <h4>Progreso: {steps[currentStep]}</h4>

            {/* Contenedor de la barra de progreso */}
            <div className="progress-container">
                <div className="progress-line-background"></div>
                <div className="progress-line" style={{ width: `${(currentStep / (steps.length - 1)) * 77   }%` }}></div>
                {steps.map((step, index) => (
                    <div key={index} className={`step ${index <= currentStep ? "active" : ""}`}>
                        <div className="circle">{index + 1}</div>
                        <p>{step}</p>
                    </div>
                ))}
            </div>

            {/* Botones de Control */}
            <div className="mt-3">
                <Button variant="secondary" onClick={prevStep} disabled={currentStep === 0}>
                    Anterior
                </Button>
                <Button variant="primary" onClick={nextStep} className="ms-2" disabled={currentStep === steps.length - 1}>
                    Siguiente
                </Button>
            </div>
        </div>
    );
};

export default StepProgressBar;
