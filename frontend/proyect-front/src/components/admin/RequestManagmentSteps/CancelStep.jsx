import React from "react";
import "./cancelStep.css";
import { Form } from "react-bootstrap";


function CancelStep ({ solicitud }){
    
    return(
        <Form className="data-container">
        <div className="row my-3">
          <div className="col-4">
            <Form.Label>Servicio</Form.Label>
            <Form.Control
              type="text"
              defaultValue={solicitud.tipoServicio}
              readOnly
            ></Form.Control>
          </div>
          <div className="col-4">
            <Form.Label>Categoria</Form.Label>
            <Form.Control
              type="text"
              value={solicitud.categoria}
              readOnly
            ></Form.Control>
          </div>
          <div className="col-4">
            <Form.Label>Producto</Form.Label>
            <Form.Control
              type="text"
              value={solicitud.tipoDeProducto}
              readOnly
            ></Form.Control>
          </div>
        </div>
        <div className="my-4"></div>
        <div className="row">
          {solicitud.tipoServicio === "Reparacion" ? (
            <>
              <div className="col-12">
                <Form.Group controlId="description">
                  <Form.Label>Descripcion del problema</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    type="text"
                    value={solicitud.descripcion}
                    readOnly
                    style={{ resize: "vertical" }}
                  />
                </Form.Group>
              </div>
            </>
          ) : null}
          <div className="row my-3">
            <div className="col-4">
              <Form.Check
                type="checkbox"
                label="Con servicio de logistica"
                checked={solicitud.conLogistica}
                readOnly
              />
            </div>
          </div>
        {solicitud.fechaPresupuestada && (
            <div className='row reviewed-show'>
              <div className='col-8'>
                <Form.Group controlId='diagnostic'>
                  <Form.Label>Diagnostico</Form.Label>
                  <Form.Control
                    as='textarea'
                    value={solicitud.diagnosticoTecnico}
                    rows={5}
                    type='text'
                    readOnly
                  />
                </Form.Group>
              </div>
              <div className='col-4'>
                <Form.Group controlId='estimated-date'>
                  <Form.Label>Fecha estimada</Form.Label>
                  <Form.Control
                    type='date'
                    value={solicitud.fechaEstimada ? new Date(solicitud.fechaEstimada).toISOString().split('T')[0] : ''}
                    readOnly
                  />
                </Form.Group>
                <Form.Group className="amount-form" controlId='amount'>
                  <Form.Label>Monto</Form.Label>
                  <Form.Control
                    type='number'
                    value={solicitud.monto || ''}
                    readOnly
                  />
                </Form.Group>
              </div>
            </div>
        )}















          <div className="row my-3">
            <Form.Group controlId="Motivo">
                  <Form.Label>Motivo de cancelación</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    type="text"
                    value={solicitud.resumen}
                    readOnly
                    style={{ resize: "vertical" }}
                  />
                </Form.Group>
        </div>
        </div>
      </Form>

    )
}

export default CancelStep;
