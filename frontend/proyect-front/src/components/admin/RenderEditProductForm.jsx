import React from 'react';
import { Form } from 'react-bootstrap';

export default function RenderEditProductForm({ selectedItem, handleEditChange, categories }) {
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
      <Form.Group>
        <Form.Label>Categoría</Form.Label>
        <Form.Control
          as="select"
          name="id_categoria"
          value={selectedItem.id_categoria || ""}
          onChange={handleEditChange}
        >
          {categories.map((category, index) => (
            <option key={index} value={category.id}>
              {category.descripcion}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
    </Form>
  );
}