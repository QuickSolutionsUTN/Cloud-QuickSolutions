import React, { useContext, useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import './modalLoginForm.css';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';


function LoginForm({ show, onClose, onJoinClick }) {
  const {signInWithEmail}= useContext(AuthContext);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');


  const handleFormSubmit = async (formValues) => {
    setErrorMessage('');
    try {
      const {role} = await signInWithEmail(formValues.email, formValues.password);

      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'maintenance') {
        navigate('/maintenance');
      }
      onClose();
    } catch (error) {
      console.error('Error al hacer login con Supabase:', error);
      let customErrorMessage = error.message || 'Error de conexión. Intente más tarde.';
      
      if (customErrorMessage.includes('Email not confirmed')) {
          customErrorMessage = 'Su correo electrónico aún no ha sido verificado. Por favor, revise su bandeja de entrada.';
      } else if (customErrorMessage.includes('Invalid login credentials')) {
          customErrorMessage = 'Credenciales inválidas.';
      }
      
      setErrorMessage(customErrorMessage);
    }
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
              className={errors.email || errorMessage ? 'error-input' : ''}
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
              className={errors.password || errorMessage ? 'error-input' : ''}
              {...register('password', { required: '*Campo obligatorio' })}
            />
            {errors.password && <p className="error-message">{errors.password.message}</p>}
          </Form.Group>
          {errorMessage && (
            <Alert variant="danger" className="mt-3">
              {errorMessage}
            </Alert>
          )}
          <Button className={`full-width-button ${errorMessage ? 'button-error' : ''}`} variant="primary" type="submit">
            Iniciar sesión
          </Button>
          <div className="button-group">
            <Button className="full-width-button" variant="secondary" onClick={() => console.log("Olvido")}>
              Olvido su contraseña?
            </Button>
            <Button className="full-width-button" variant="secondary" onClick={onJoinClick}>
              Registrarse
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default LoginForm;