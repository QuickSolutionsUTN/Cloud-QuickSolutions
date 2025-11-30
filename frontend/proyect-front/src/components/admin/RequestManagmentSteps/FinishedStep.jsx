import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Form } from 'react-bootstrap';
import { useBackendURL } from '../../../contexts/BackendURLContext.jsx';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faDollarSign } from "@fortawesome/free-solid-svg-icons";

import "./finishedStep.css";

function FinishedStep({ solicitud }) {

  const adjustTextareaHeight = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  useEffect(() => {
    if (solicitud) {
      const textarea = document.getElementById('summary');
      if (textarea) {
        adjustTextareaHeight({ target: textarea });
      }
    }
  }, [solicitud]);


  if (!solicitud) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="data-container finished-step-container">
      <Form>
        <div className='row my-3'>
          <div className='col-6 diagnostic-column '>
            <Form.Group controlId='diagnostic'>
              <Form.Label className="fw-bold">Diagnostico</Form.Label>
              <Form.Control
                as='textarea'
                type='text'
                value={solicitud.diagnosticoTecnico}
                readOnly
                style={{ resize: 'none', overflow: 'hidden' }}
                onInput={adjustTextareaHeight}
              />
            </Form.Group>
          </div>
        </div>
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
        <div className='row my-3'>
          <div className='col-12'>
            <Form.Group controlId='summary'>
              <Form.Label className="fw-bold">Resumen del trabajo</Form.Label>
              <Form.Control
                as='textarea'
                type='text'
                value={solicitud.Resumen}
                readOnly
                style={{ resize: 'none', overflow: 'hidden' }}
                onInput={adjustTextareaHeight}
              />
            </Form.Group>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default FinishedStep;