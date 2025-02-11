import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function RenderAddMaintenanceForm({ newMaintenance, handleChange, products, tasks, handleTaskChange, addTask }) {
  return (
    <Form>
      <Form.Group className="mb-3">
        <Row>
          <Col>
            <Form.Label>Producto</Form.Label>
            <Form.Control
              as="select"
              name="idTipoProducto"
              value={newMaintenance.idTipoProducto || ""}
              onChange={handleChange}
            >
              <option value="">Seleccione un producto</option>
              {products.map((product, index) => (
                <option key={index} value={product.id}>
                  {product.descripcion}
                </option>
              ))}
            </Form.Control>
          </Col>
          <Col>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={newMaintenance.nombre}
              onChange={handleChange}
            />
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          type="text"
          name="descripcion"
          value={newMaintenance.descripcion}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Row>
          <Col> <Form.Label>Tareas</Form.Label> </Col>
          <Col xs="auto">
            <Button variant="outline-primary" onClick={addTask}>
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </Col>
        </Row>
        {tasks.map((task, index) => (
          <Row key={index} className="mb-2">
            <Col>
              <Form.Control
                type="text"
                name={`task-${index}`}
                value={task.descripcion}
                onChange={(e) => handleTaskChange(e, index)}
                placeholder="Descripción de la tarea"
              />
            </Col>
            <Col xs="auto">
              <Form.Check
                type="checkbox"
                name={`mandatory-${index}`}
                checked={task.mandatory}
                onChange={(e) => handleTaskChange(e, index)}
                label="Obligatoria"
              />
            </Col>
          </Row>
        ))}

      </Form.Group>
    </Form>
  );
}