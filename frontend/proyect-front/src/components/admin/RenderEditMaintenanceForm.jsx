import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function RenderEditMaintenanceForm({ selectedItem, handleEditChange, products, handleTaskChange, addTask }) {
  return (
    <Form>
      <Form.Group className="mb-3">
        <Row>
          <Col>
            <Form.Label>Producto</Form.Label>
            <Form.Control
              as="select"
              name="idTipoProducto"
              value={selectedItem.idTipoProducto || ""}
              onChange={handleEditChange}
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
              value={selectedItem.nombre}
              onChange={handleEditChange}
            />
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          type="text"
          name="descripcion"
          value={selectedItem.descripcion}
          onChange={handleEditChange}
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
        {selectedItem.checkList.map((task, index) => (
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
                checked={task.obligatorio}
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