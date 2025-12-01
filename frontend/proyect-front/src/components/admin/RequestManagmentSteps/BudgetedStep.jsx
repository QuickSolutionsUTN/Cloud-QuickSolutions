import { useEffect, useState } from "react";
import { Form, Button, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faDollarSign, faSquare } from "@fortawesome/free-solid-svg-icons";

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
          <div className="info-card mb-4">
            <div className="row mx-0 w-100 py-2">

              <div className="col-md-7 mb-4 mb-md-0 ribbon-item">
                <div className="section-label mb-2">Diagnóstico Técnico</div>

                <div className="description-card important h-100">
                  <span className="budgeted">
                    {solicitud.diagnosticoTecnico || "Sin diagnóstico registrado."}
                  </span>
                </div>
              </div>

              <div className="col-md-5 d-flex flex-column justify-content-center ps-md-4">

                <div className="mb-4"> 
                  <div className="section-label">Fecha estimada</div>
                  <div className="data-value d-flex align-items-center">
                    <FontAwesomeIcon icon={faCalendar} className="me-2 text-primary opacity-50" />
                    <span className="fs-5">
                      {solicitud.fechaEstimada
                        ? new Date(solicitud.fechaEstimada).toLocaleDateString()
                        : "No definida"}
                    </span>
                  </div>
                </div>

                {/* ITEM 2: MONTO (Abajo) */}
                <div>
                  <div className="section-label">Monto Presupuestado</div>
                  <div className="data-value d-flex align-items-center">
                    <FontAwesomeIcon icon={faDollarSign} className="me-2 text-success" />
                    <span className="fs-2 fw-bold text-success" style={{ letterSpacing: '-0.5px' }}>
                      {/* fs-2 hace el número bien grande e importante */}
                      {solicitud.monto
                        ? new Intl.NumberFormat('es-AR', { minimumFractionDigits: 0 }).format(solicitud.monto)
                        : "0"}
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          <div className='row reviewed-show'>
            {solicitud.mantenimiento?.checklist && (
              <div className='col-12'>
                <div className="col-12 mb-3">
                  <div className="section-label mb-2">Descripción del mantenimiento</div>

                  <div className="description-card">
                    {solicitud.mantenimiento?.descripcion || "Sin descripción proporcionada."}
                  </div>
                </div>
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