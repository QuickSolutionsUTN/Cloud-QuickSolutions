import React from 'react';
import { Form } from 'react-bootstrap';

export default function RenderEditCategoryForm({ selectedItem, handleEditChange, errors = {} }) {
  return (
    <Form>
      <Form.Group>
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          type="text"
          name="descripcion"
          value={selectedItem.descripcion || ""}
          onChange={handleEditChange}
          isInvalid={!!errors.descripcion}
        />
        <Form.Control.Feedback type="invalid">
          {errors.descripcion}
        </Form.Control.Feedback>
      </Form.Group>
    </Form>
  );
}