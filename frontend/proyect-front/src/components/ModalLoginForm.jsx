import React, { useContext, useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import './modalLoginForm.css';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import AuthContext from '../contexts/AuthContext';
import { useBackendURL } from '../contexts/BackendURLContext';
import axios from 'axios';

function LoginForm({ show, onClose, onJoinClick }) {
  const backendURL = useBackendURL();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormSubmit = async (data) => {
    setErrorMessage(''); // Clear error message on new submit attempt
    try {
      console.log("Clic en Iniciar Sesión");
      const response = await axios.post(`${backendURL}/api/users/login`, data);
      if (response.status === 200) {
        const userToken = response.data.token;
        const userRole = jwtDecode(userToken)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        const userId = jwtDecode(userToken)['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
        const userName = jwtDecode(userToken)['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
        const userSurname = jwtDecode(userToken)['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'];
        console.log("Usuario autenticado correctamente, token: ", userToken);
        try {
          const decodedToken = jwtDecode(userToken);
          const userData = {
            userId: userId,
            role: userRole,
            email: decodedToken.email,
            token: userToken,
            refreshToken: response.data.refreshToken,
            name: userName,
            surName: userSurname
          }
          login(userData);
          // Redirigir al usuario la página correspondiente
          if (userRole === 'admin') {
            navigate('/admin');
          } else if (userRole === 'maintenance') {
            navigate('/maintenance');
          }
          onClose();
        } catch (error) {
          console.error('Error al decodificar el token:', error);
          setErrorMessage("Token inválido. Intente nuevamente.");
        }
      }
    } catch (error) {
      console.error('Error al hacer login:', error);
      const errorMessage = error.response?.data?.message || "Error de conexión. Intente más tarde.";
      setErrorMessage(errorMessage);
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