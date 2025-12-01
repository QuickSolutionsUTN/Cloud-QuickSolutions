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
    <div className="finished-step-container">
      <Form>
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