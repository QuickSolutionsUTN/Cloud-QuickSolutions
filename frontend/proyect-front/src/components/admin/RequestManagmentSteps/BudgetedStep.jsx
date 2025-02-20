import { useEffect, useState } from "react";
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faDollarSign } from "@fortawesome/free-solid-svg-icons";

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
      <div className="data-container budgeted-step-container">
        <Form className='reviewed-step-form' onSubmit={handleNextStep}>
          <div className="row my-3">
            <div className="col-4 d-flex flex-column">
              <Form.Group controlId="estimated-date">
                <Form.Label className="fw-bold">
                  <FontAwesomeIcon icon={faCalendar} className="me-2" />
                  Fecha estimada</Form.Label>
                <Form.Control
                  type="date"
                  value={solicitud.fechaEstimada ? new Date(solicitud.fechaEstimada).toISOString().split("T")[0] : ""}
                  readOnly
                />
              </Form.Group>
            </div>
            <div className="col-4 d-flex flex-column">
              <Form.Group controlId="amount">
                <Form.Label className="fw-bold">
                  <FontAwesomeIcon icon={faDollarSign} className="me-2" />
                  Monto</Form.Label>
                <Form.Control
                  type="number"
                  value={solicitud.monto || ""}
                  readOnly
                />
              </Form.Group>
            </div>
          </div>
          <div className='row reviewed-show'>
            <div className='col-diagnostic'>
              <Form.Group controlId='diagnostic'>
                <Form.Label className="fw-bold">Diagnostico</Form.Label>
                <Form.Control
                  as="textarea"
                  type="text"
                  value={solicitud.diagnosticoTecnico}
                  readOnly
                  style={{ resize: 'none', overflow: 'hidden' }}
                  onInput={adjustTextareaHeight}
                />
              </Form.Group>
            </div>
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