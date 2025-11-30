import React from 'react';
import { Form } from 'react-bootstrap';

export default function RenderEditProductForm({ selectedItem, handleEditChange, categories, errors = {} }) {
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
      <Form.Group>
        <Form.Label>Categoría</Form.Label>
        <Form.Control
          as="select"
          name="id_categoria"
          value={selectedItem.id_categoria || ""}
          onChange={handleEditChange}
          isInvalid={!!errors.id_categoria}
        >
          <option value="">Selecciona una categoría</option>
          {categories.map((category, index) => (
            <option key={index} value={category.id}>
              {category.descripcion}
            </option>
          ))}
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          {errors.id_categoria}
        </Form.Control.Feedback>
      </Form.Group>
    </Form>
  );
}