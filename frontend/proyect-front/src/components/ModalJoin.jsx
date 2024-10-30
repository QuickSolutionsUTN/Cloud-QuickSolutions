import React, { useState, useContext } from 'react';
import "./ModalJoin.css";
import { Modal, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import AuthContext from '../contexts/AuthContext';
import { useBackendURL } from '../contexts/BackendURLContext';

function ModalJoin({ show, onClose }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useContext(AuthContext);
  const backendURL = useBackendURL();
  const [errorMessage, setErrorMessage] = useState('');

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  const handleFormSubmit = async (data) => {
    try {
      const response = await fetch(`${backendURL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const result = await response.json();
      login(result);
      onClose();
    } catch (error) {
      setErrorMessage('Registration failed. Please try again.');
    }
  };

  return (
    <Modal size='xl' show={show} onHide={onClose} dialogClassName="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title>Registrese</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="form-group-inline"> 
            <Form.Group controlId="formName" className="form-group">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese su nombre"
                {...register('name', { required: '*Campo obligatorio' })}
              />
              {errors.name && <p className="error-message">{errors.name.message}</p>}
            </Form.Group>
            <Form.Group controlId="formLastName" className="form-group">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese su apellido"
                {...register('lastName', { required: '*Campo obligatorio' })}
              />
              {errors.lastName && <p className="error-message">{errors.lastName.message}</p>}
            </Form.Group>
          </div>
          
          <Form.Group controlId="formBirthDate">
            <Form.Label>Fecha de Nacimiento</Form.Label>
            <div className="d-flex birthdate">
              <Form.Select className='selector' {...register('day', { required: '*Campo obligatorio' })}>
                <option value="">Día</option>
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </Form.Select>
              <Form.Select className='selector' {...register('month', { required: '*Campo obligatorio' })}>
                <option value="">Mes</option>
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </Form.Select>
              <Form.Select className='selector' {...register('year', { required: '*Campo obligatorio' })}>
                <option value="">Año</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </Form.Select>
            </div>
            {(errors.day || errors.month || errors.year) && (
              <p className="error-message">Fecha de nacimiento es obligatoria</p>
            )}
          </Form.Group>

          <Form.Group controlId="formEmail" className='email'>
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingrese su correo electrónico"
              {...register('email', { required: '*Campo obligatorio' })}
            />
            {errors.email && <p className="error-message">{errors.email.message}</p>}
          </Form.Group>
          
          <Form.Group controlId="formPassword" className='password'>
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingrese su contraseña"
              {...register('password', { required: '*Campo obligatorio' })}
            />
            {errors.password && <p className="error-message">{errors.password.message}</p>}
          </Form.Group>
          <Form.Group controlId="formPasswordRepeat" className='passwordRepeat'>
            <Form.Control
              type="password"
              placeholder="Repita su contraseña"
              {...register('password', { required: '*Campo obligatorio' })}
            />
            {errors.password && <p className="error-message">{errors.password.message}</p>}
          </Form.Group>

          <Button variant="primary" type="submit" className='join'>
            Registrarse
          </Button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ModalJoin;