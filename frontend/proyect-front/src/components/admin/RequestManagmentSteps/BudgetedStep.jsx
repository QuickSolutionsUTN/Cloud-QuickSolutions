import { useState } from "react";
import { Form } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare } from "@fortawesome/free-solid-svg-icons";

import "./budgetedStep.css";

function BudgetedStep({ solicitud, nextStep, cancelStep, handleChange }) {
  const [fechaFormateada, setFechaFormateada] = useState('');

  const handleNextStep = (event) => {
    event.preventDefault();
    nextStep();
  };

  const adjustTextareaHeight = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  if (!solicitud) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <div className="budgeted-step-container">
        <Form className='reviewed-step-form' onSubmit={handleNextStep}>
          <div className='row reviewed-show'>
            {solicitud.mantenimiento?.checklist && (
              <div className='col-12'>
                <div className="mt-2">
                  <h6 className="section-label mb-2">Checklist de Mantenimiento Preventivo</h6>

                  <div className="bg-white rounded border" style={{ overflow: 'hidden' }}>
                    {solicitud.mantenimiento?.checklist?.map((item) => (

                      <div key={item.id} className="checklist-item">

                        <FontAwesomeIcon icon={faSquare} className="check-icon" />

                        <div className="d-flex flex-column flex-grow-1">
                          <span className="text-dark fw-medium">{item.descripcion}</span>
                        </div>

                        {item.obligatorio && (
                          <span className="badge bg-light text-secondary border ms-2">
                            Obligatorio
                          </span>
                        )}
                      </div>

                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Form >
      </div >
      <div className="budgeted-step-waiting">
        <h6>Esperando respuesta del cliente</h6>
      </div>
    </>
  );
}

export default BudgetedStep;