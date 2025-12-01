import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Container, Card, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { supabase } from '../services/supabaseClient'; // Asegúrate de que esta ruta sea correcta
import AuthContext from '../contexts/AuthContext'; 

export default function UpdatePasswordPage() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageVariant, setMessageVariant] = useState('info');
    const { session } = useContext(AuthContext); // Usamos el contexto para verificar si hay una sesión activa

    const newPassword = watch('newPassword');

    useEffect(() => {
        // Supabase maneja el token de restablecimiento a través de los parámetros de la URL
        // y lo convierte en una sesión temporal cuando la página se carga.
        // Si ya hay una sesión (lo que indica que el enlace de Supabase funcionó),
        // pero no es la sesión principal (ya que no deberían estar logueados normalmente),
        // permitimos que el usuario cambie la contraseña.
        // Si no hay sesión o hay un error de autenticación, SupabaseAuthClient te ayuda.
        
        // Simplemente nos aseguramos de que el usuario vea el formulario.
        // La lógica de Supabase maneja la autenticación temporal del token en la URL.
    }, []);

    const onSubmit = async (data) => {
        setMessage('');
        setLoading(true);

        try {
            // Llama a la API de Supabase para actualizar la contraseña
            // Supabase usa la sesión temporal que se estableció al redirigir desde el email
            const { error } = await supabase.auth.updateUser({
                password: data.newPassword
            });

            if (error) {
                console.error("Error al actualizar la contraseña:", error);
                setMessage('❌ Error al actualizar la contraseña. Inténtelo de nuevo.');
                setMessageVariant('danger');
                return;
            }

            setMessage('✅ Contraseña actualizada exitosamente. Redirigiendo al inicio de sesión...');
            setMessageVariant('success');

            // Redirigir al usuario al login después de un breve retraso
            setTimeout(() => {
                navigate('/'); 
            }, 3000);

        } catch (err) {
            console.error("Error inesperado:", err);
            setMessage('❌ Error inesperado. Por favor, revise la consola.');
            setMessageVariant('danger');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5 d-flex justify-content-center">
            <Card style={{ width: '400px' }} className="shadow-lg">
                <Card.Body>
                    <Card.Title className="text-center mb-4">Restablecer Contraseña</Card.Title>
                    {message && <Alert variant={messageVariant}>{message}</Alert>}
                    
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group className="mb-3" controlId="newPassword">
                            <Form.Label>Nueva Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Ingrese nueva contraseña"
                                {...register('newPassword', { 
                                    required: 'La nueva contraseña es obligatoria',
                                    minLength: {
                                        value: 8,
                                        message: 'La contraseña debe tener al menos 8 caracteres'
                                    }
                                })}
                                isInvalid={!!errors.newPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.newPassword?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="confirmPassword">
                            <Form.Label>Confirmar Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirme su contraseña"
                                {...register('confirmPassword', { 
                                    required: 'Debe confirmar la contraseña',
                                    validate: value => 
                                        value === newPassword || 'Las contraseñas no coinciden'
                                })}
                                isInvalid={!!errors.confirmPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.confirmPassword?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="w-100" 
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Actualizando...
                                </>
                            ) : (
                                'Actualizar Contraseña'
                            )}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}