import "./StepProgressBar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'  

const StepProgressBar = ({ currentStep, solicitud }) => {
  const isCancelled = currentStep === "Cancelada";
  
  // Si está cancelada, el último paso se llama "Cancelada" en vez de "Finalizada"
  const steps = isCancelled 
    ? ["Iniciada", "Revisada", "Presupuestada", "Aprobada", "Cancelada"]
    : ["Iniciada", "Revisada", "Presupuestada", "Aprobada", "Finalizada"];
  
  const stepIndex = isCancelled ? steps.length - 1 : steps.indexOf(currentStep);
  
  const formatDate = (dateTime) => {
    if (!dateTime) return "";
    const date = new Date(dateTime);
    return date.toLocaleDateString();
  };

  const formatTime = (dateTime) => {
    if (!dateTime) return "";
    const date = new Date(dateTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Determinar si un paso está completado basándose en las fechas
  const isStepCompleted = (step) => {
    switch (step) {
      case "Iniciada":
        return !!solicitud.fechaIniciada;
      case "Revisada":
        return !!solicitud.fechaRevisada;
      case "Presupuestada":
        return !!solicitud.fechaPresupuestada;
      case "Aprobada":
        return !!solicitud.fechaAprobada;
      case "Finalizada":
        return !!solicitud.fechaFinalizada;
      case "Cancelada":
        return !!solicitud.fechaCancelada;
      default:
        return false;
    }
  };

  return (
    <div className="admin-progress-bar container text-center mt-4">
      <div className="progress-container">
        <div className="progress-line-background"></div>
        <div 
          className={`progress-line${isCancelled ? "-cancelled" : ""}`} 
          style={{ width: `${(stepIndex / (steps.length - 1)) * 80}%` }}
        ></div>
        {steps.map((step, index) => {
          const isCompleted = isCancelled 
            ? (step === "Cancelada" ? true : isStepCompleted(step))
            : index <= stepIndex;
          const isLastStep = index === steps.length - 1;
          const isCancelledStep = isCancelled && isLastStep;
          
          return (
            <div key={index} className={`step ${isCompleted ? "active" : ""} ${isCancelledStep ? "cancelled" : ""}`}>
              <div className={`circle${isCancelledStep ? "-cancelled" : ""}`}>
                {isCancelledStep ? (
                  <FontAwesomeIcon icon={faTimes} />
                ) : isLastStep && isCompleted && !isCancelled ? (
                  <FontAwesomeIcon icon={faCheck} />
                ) : (
                  index + 1
                )}
              </div>
              <p className={`step-name${isCancelledStep ? "-cancelled" : ""}`}>{step}</p>
              <p className={`date ${isCompleted ? "visible" : ""}`}>
                {step === "Iniciada" && solicitud.fechaIniciada && formatDate(solicitud.fechaIniciada)}
                {step === "Revisada" && solicitud.fechaRevisada && formatDate(solicitud.fechaRevisada)}
                {step === "Presupuestada" && solicitud.fechaPresupuestada && formatDate(solicitud.fechaPresupuestada)}
                {step === "Aprobada" && solicitud.fechaAprobada && formatDate(solicitud.fechaAprobada)}
                {step === "Finalizada" && solicitud.fechaFinalizada && formatDate(solicitud.fechaFinalizada)}
                {step === "Cancelada" && solicitud.fechaCancelada && formatDate(solicitud.fechaCancelada)}
              </p>
              <p className={`time ${isCompleted ? "visible" : ""}`}>
                {step === "Iniciada" && solicitud.fechaIniciada && formatTime(solicitud.fechaIniciada)}
                {step === "Revisada" && solicitud.fechaRevisada && formatTime(solicitud.fechaRevisada)}
                {step === "Presupuestada" && solicitud.fechaPresupuestada && formatTime(solicitud.fechaPresupuestada)}
                {step === "Aprobada" && solicitud.fechaAprobada && formatTime(solicitud.fechaAprobada)}
                {step === "Finalizada" && solicitud.fechaFinalizada && formatTime(solicitud.fechaFinalizada)}
                {step === "Cancelada" && solicitud.fechaCancelada && formatTime(solicitud.fechaCancelada)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgressBar;