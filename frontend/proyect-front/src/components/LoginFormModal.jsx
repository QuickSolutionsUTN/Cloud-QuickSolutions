import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import '../styles/LoginFormModal.css';
import { useForm } from 'react-hook-form';

function LoginForm({ show, onClose, onSubmit }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const handleFormSubmit = data => {
    console.log(data);
    onSubmit(data);
  };
  return (
    <Modal show={show} onHide={onClose} >
      <Modal.Header closeButton>
        <Modal.Title>Iniciar Sesión</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label className={errors.email ? 'error-label' : ''}>Correo electronico</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="Ingrese correo electronico"
              className={errors.email ? 'error-input' : ''}
              {...register('email', { 
                required: '*Campo obligatorio', 
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: '*Correo electronico invalido'
                }
              })} 
            />
            {errors.email && <p className="error-message">{errors.email.message}</p>}
          </Form.Group>

          <Form.Group controlId="formBasicPassword" className='login-form-control'>
            <Form.Label className={errors.password ? 'error-label' : ''}>Contraseña</Form.Label>
            <Form.Control
              type="password" 
              placeholder="Ingrese contraseña"
              className={errors.password ? 'error-input' : ''} 
              {...register('password', { required: '*Campo obligatorio' })} 
            />
            {errors.password && <p className="error-message">{errors.password.message}</p>}
          </Form.Group>

          <Button className="full-width-button" variant="primary" type="submit">
            Iniciar sesión
          </Button>
          <div className="button-group">
            <Button className="full-width-button" variant="secondary" onClick={() => console.log("Olvido")}>
              Olvido su contraseña?
            </Button>
            <Button className="full-width-button" variant="secondary" onClick={() => console.log("Registrarse")}>
              Registrarse
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default LoginForm;