import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function RenderMaintenanceForm({ maintenance = { nombre: '', descripcion: '', checklist: [] },  handleChange }) {

  const handleChecklistChange = (index, field, value) => {
    const updatedChecklist = [...maintenance.checklist];
    updatedChecklist[index][field] = value;
    handleChange({ target: { name: 'checklist', value: updatedChecklist } });
  };

  const addTask = () => {
    const currentChecklist = maintenance.checklist || [];
    const updatedChecklist = [...currentChecklist, { descripcion: '', obligatorio: false }];
    handleChange({ target: { name: 'checklist', value: updatedChecklist } });
  };

  return (
    <Form>
      <Form.Group className="mb-3">
        <Row>
          <Col>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={maintenance.nombre}
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
          value={maintenance.descripcion}
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
        {(maintenance.checklist ? maintenance.checklist : []).map((task, index) => (
          <Row key={index} className="mb-2">
            <Col>
              <Form.Control
                type="text"
                name={`task-${index}`}
                value={task.descripcion}
                onChange={(e) => handleChecklistChange(index, "descripcion", e.target.value)}
                placeholder="Descripción de la tarea"
              />
            </Col>
            <Col xs="auto">
              <Form.Check
                type="checkbox"
                name={`mandatory-${index}`}
                checked={task.obligatorio}
                onChange={(e) => handleChecklistChange(index, "obligatorio", e.target.checked)}
                label="Obligatoria"
              />
            </Col>
          </Row>
        ))}
      </Form.Group>
    </Form>
  );
}