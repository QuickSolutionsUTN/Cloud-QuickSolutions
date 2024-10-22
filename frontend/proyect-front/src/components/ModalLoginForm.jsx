import React, { useContext, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import '../styles/modalLoginForm.css';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import AuthContext from '../contexts/AuthContext';

function LoginForm({ show, onClose, onSubmit }) {
  
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormSubmit = async (data) => {
    //console.log(data);
    try{
      const response=await fetch('https://localhost:7216/api/usuarios/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      });

      // Verifica si la respuesta fue exitosa
      if (!response.ok) {
        const errorData = await response.json(); // Suponiendo que la respuesta de error también es JSON
        throw new Error(errorData.message || 'Error en la autenticación');
      }

      const result = await response.json();
      console.log('Respuesta del backend:', result);

      if (result.status === "success") {
        const token = result.data.token;// Guarda el token
        console.log('Token:', token);

        try{
          const decodedToken = jwtDecode(token);
          console.log('Token decodificado:', decodedToken);

          const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
          console.log('Rol del usuario:', userRole);

          onSubmit(data, userRole);

          // Redirigir al usuario la página correspondiente
          if (userRole === 'admin') {
            navigate('/admin');
          } else if (userRole === 'maintenance') {
            navigate('/maintenance');
          }

        }catch (error) {
          console.error('Error al decodificar el token:', error);
      }
        
        //onClose();
  
        // Aquí puedes almacenar el token en localStorage o en el contexto de la aplicación
      } else {
          console.error('Error en el login:', result.message);
      }
      
    } catch (error) {
      console.error('Error al hacer login:', error);
      setErrorMessage(error.message);
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