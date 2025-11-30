import React, { useContext, useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import apiService from '../../../services/axiosConfig.jsx';
import "./cancelModalForm.css";

function CancelModalForm({ show, onClose }) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { id: solicitudId } = useParams();
  const navigate = useNavigate();
  const reason = watch('reason', '');

  const onSubmit = async (data) => {
    try {
      // Use central apiService so the auth interceptor attaches the token
      await apiService.cancelRequest(solicitudId, { resumen: data.reason });
      window.location.reload();
    } catch (error) {
      console.error('Error cancelling request:', error);
    }
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Estas seguro de que desea cancelar la solicitud?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="cancelForm" className='cancel-reason'>
            <Form.Label>Motivo</Form.Label>
            <Form.Control className='cancel-reason-input'
              as="textarea"
              rows={5}
              placeholder="Ingrese el motivo"
              {...register('reason', { required: true })}
            />
            {errors.reason && <p className="error-text" style={{ color: 'red', fontSize: 'small' }}>{errors.reason.message}</p>}
          </Form.Group>
          <div className='cancel-buttons'>
            <Button variant="secondary" onClick={onClose}>
              Volver
            </Button>
            <Button variant="danger" type="submit" disabled={!reason}>
              Cancelar solicitud
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CancelModalForm;