import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function RenderMaintenanceForm({ maintenance = { nombre: '', descripcion: '', checklist: [] }, handleChange, errors = {} }) {

  const handleChecklistChange = (index, field, value) => {
    const updatedChecklist = [...maintenance.checklist];
    updatedChecklist[index][field] = value;
    handleChange({ target: { name: 'checklist', value: updatedChecklist } });
  };

  const addTask = () => {
    const currentChecklist = maintenance.checklist || [];
    const updatedChecklist = [...currentChecklist, { tarea: '', obligatorio: false }];
    handleChange({ target: { name: 'checklist', value: updatedChecklist } });
  };

  const removeTask = (index) => {
    const currentChecklist = maintenance.checklist || [];
    const updatedChecklist = currentChecklist.filter((_, i) => i !== index);
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
              isInvalid={!!errors?.nombre}
            />
            <Form.Control.Feedback type="invalid">
              {errors?.nombre}
            </Form.Control.Feedback>
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
          isInvalid={!!errors?.descripcion}
        />
        <Form.Control.Feedback type="invalid">
          {errors?.descripcion}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-1">
        <Row>
          <Col> <Form.Label>Tareas</Form.Label> </Col>
          <Col xs="auto" className="mb-3">
            <Button variant="outline-primary" size="sm" onClick={addTask}>
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </Col>
        </Row>
        {(maintenance.checklist ? maintenance.checklist : []).map((task, index) => (
          <Row key={index} className="mb-3">
            <Col>
              <Form.Control
                type="text"
                name={`task-${index}`}
                value={task.tarea}
                onChange={(e) => handleChecklistChange(index, "tarea", e.target.value)}
                placeholder="Descripción de la tarea"
                isInvalid={!!errors?.checklist?.[index]?.tarea}
              />
              <Form.Control.Feedback type="invalid">
                {errors?.checklist?.[index]?.tarea}
              </Form.Control.Feedback>
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
            <Col xs="auto">
              <Button variant="outline-danger" size="sm" onClick={() => removeTask(index)}>
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </Col>
          </Row>
        ))}
      </Form.Group>
    </Form>
  );
}