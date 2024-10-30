import React, { useContext, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
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
    try {
      console.log("Clic en Iniciar Sesión");
      const response = await axios.post(`${backendURL}/usuarios/login`, data);

      if (response.status === 200 && response.data.status === "success") {
        const userToken = response.data.data.token;// Guarda el token

        if (userToken) {
          localStorage.setItem('authToken', userToken);
          console.log("Usuario autenticado correctamente");
          try {
            const decodedToken = jwtDecode(userToken);
            console.log("Token decodificado:", decodedToken);
            const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            
            const userData={
              role: userRole,
              email: decodedToken.email,
              token:userToken,
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
      } else {
        console.error('Error en el login:', response.data.message);
        setErrorMessage(response.data.message || "Error desconocido en el login.");
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
          {errorMessage && <p className="error-message" style={{ marginTop: '10px', marginBottom: '5px' }}>*{errorMessage}</p>}
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