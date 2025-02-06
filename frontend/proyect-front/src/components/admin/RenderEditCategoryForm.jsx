import React from 'react';
import { Form } from 'react-bootstrap';

export default function RenderEditProductForm({ selectedItem, handleEditChange }) {
  return (
    <Form>
      <Form.Group>
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          type="text"
          name="descripcion"
          value={selectedItem.descripcion || ""}
          onChange={handleEditChange}
        />
      </Form.Group>
    </Form>
  );
}