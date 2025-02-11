import React, { useContext, useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useBackendURL } from '../../../contexts/BackendURLContext';
import axios from 'axios';

function CancelModalForm({ show, onClose, onSubmitClick }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const backendURL = useBackendURL();
  const { id: solicitudId } = useParams();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axios.put(`${backendURL}/api/solicitud/cancelar`, {
        id: solicitudId,
        motivo: data.reason
      });
      onClose();
      navigate('/admin/requests');
    } catch (error) {
      console.error('Error cancelling request:', error);
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Estas seguro de que desea eliminar la solicitud?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="cancelForm">
            <Form.Label>Motivo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese el motivo"
              {...register('reason', { required: true })}
            />
            {errors.reason && <Alert variant="danger">Este campo es obligatorio</Alert>}
          </Form.Group>
          <Button variant="danger" type="submit">
            Cancelar solicitud
          </Button>
          <Button variant="secondary" onClick={onSubmitClick}>
            Volver
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CancelModalForm;