import React, { useContext, useState } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import './modalLoginForm.css';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';


function LoginForm({ show, onClose, onJoinClick }) {
  const { signInWithEmail, resetPasswordForEmail } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleForgotPasswordClick = () => {
    setIsResetMode(true);
    setErrorMessage('');
    setSuccessMessage('');
    reset();
  };
  const handleBackToLoginClick = () => {
    setIsResetMode(false);
    setErrorMessage('');
    setSuccessMessage('');
    reset();
  };
  const handleResetPasswordSubmit = async (data) => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await resetPasswordForEmail(data.email);
      setSuccessMessage('✅ ¡Listo! Se ha enviado un correo electrónico con el enlace para restablecer su contraseña. Por favor, revise su bandeja de entrada (y la carpeta de Spam).');
      setTimeout(() => {
        handleBackToLoginClick();
        onClose();
      }, 5000);
    } catch (error) {
      console.error('Error al solicitar restablecimiento de contraseña:', error);
      setErrorMessage('Si el correo electrónico existe en nuestro sistema, recibirá un enlace para restablecer su contraseña.');
    } finally {
      setLoading(false);
    }
  };
  const handleFormSubmit = async (formValues) => {
    setErrorMessage('');
    try {
      const { role } = await signInWithEmail(formValues.email, formValues.password);

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
    <Modal show={show} onHide={isResetMode ? handleBackToLoginClick : onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isResetMode ? 'Restablecer Contraseña' : 'Iniciar Sesión'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Muestras el mensaje de error o éxito */}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <form onSubmit={handleSubmit(isResetMode ? handleResetPasswordSubmit : handleFormSubmit)}>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingrese su email"
              {...register("email", {
                required: "El email es obligatorio",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Dirección de correo no válida"
                }
              })}
            />
            {errors.email && <p className="text-danger small">{errors.email.message}</p>}
          </Form.Group>

          {!isResetMode && (
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Contraseña"
                {...register("password", { required: "La contraseña es obligatoria" })}
              />
              {errors.password && <p className="text-danger small">{errors.password.message}</p>}
            </Form.Group>
          )}

          <Button
            className={`full-width-button ${errorMessage ? 'button-error' : ''}`}
            variant="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : isResetMode ? 'Enviar Enlace de Restablecimiento' : 'Iniciar Sesión'}
          </Button>

          <p className="text-center mt-3">
            {isResetMode ? (
              <span
                className="text-primary"
                style={{ cursor: 'pointer' }}
                onClick={handleBackToLoginClick}
              >
                Volver a Iniciar Sesión
              </span>
            ) : (
              <span
                className="text-primary"
                style={{ cursor: 'pointer' }}
                onClick={handleForgotPasswordClick}
              >
                ¿Olvidaste tu contraseña?
              </span>
            )}
          </p>

          <p className="text-center mt-3">
            ¿No tienes cuenta? <span className="text-primary" style={{ cursor: 'pointer' }} onClick={onJoinClick}>Regístrate aquí</span>
          </p>

        </form>
      </Modal.Body>
    </Modal>
  );
}

export default LoginForm;