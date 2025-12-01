import React, { useState, useContext } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { supabase } from '../../services/supabaseClient'; // Asegúrate de la ruta
import AuthContext from '../../contexts/AuthContext'; 

export default function UpdateEmailModal({ show, handleClose }) {
    const { session } = useContext(AuthContext); 
    const currentEmail = session?.user?.email;
    
    // Inicializamos el formulario con el email actual del usuario
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            newEmail: currentEmail || ''
        }
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageVariant, setMessageVariant] = useState('info');

    // Resetear el estado y el formulario al abrir/cerrar el modal
    React.useEffect(() => {
        if (show) {
            reset({ newEmail: currentEmail || '' });
            setMessage('');
            setLoading(false);
        }
    }, [show, currentEmail, reset]);

    const onSubmit = async (data) => {
        setMessage('');
        setLoading(true);

        const newEmail = data.newEmail.trim();

        if (newEmail === currentEmail) {
            setMessage('El nuevo email ingresado es el mismo que el actual.');
            setMessageVariant('warning');
            setLoading(false);
            return;
        }

        try {
            // Llama a la API de Supabase para actualizar el email
            // Supabase enviará un enlace de verificación al nuevo email.
            const { error } = await supabase.auth.updateUser({ 
                email: newEmail 
            });

            if (error) {
                console.error("Error al actualizar el email:", error);
                setMessage('❌ Error al solicitar el cambio de email. Inténtelo de nuevo.');
                setMessageVariant('danger');
                return;
            }

            // Mensaje de éxito informando sobre la necesidad de verificación.
            setMessage('✅ Solicitud enviada. Se ha enviado un **enlace de confirmación** al nuevo email (' + newEmail + '). Por favor, revísalo para completar el cambio.');
            setMessageVariant('success');

        } catch (err) {
            console.error("Error inesperado:", err);
            setMessage('❌ Error inesperado. Por favor, revise la consola.');
            setMessageVariant('danger');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Modificar Email</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {message && <Alert variant={messageVariant}>{message}</Alert>}
                
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3" controlId="currentEmail">
                        <Form.Label>Email Actual</Form.Label>
                        <Form.Control
                            type="email"
                            value={currentEmail || 'Cargando...'}
                            disabled
                        />
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="newEmail">
                        <Form.Label>Nuevo Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Ingrese su nuevo email"
                            {...register('newEmail', { 
                                required: 'El nuevo email es obligatorio',
                                pattern: {
                                    value: /^\S+@\S+\.\S+$/,
                                    message: 'Formato de email inválido'
                                }
                            })}
                            isInvalid={!!errors.newEmail}
                            disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.newEmail?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button 
                        className={`full-width-button ${messageVariant === 'danger' ? 'button-error' : ''} mt-3`} 
                        variant="primary" 
                        type="submit" 
                        // Deshabilitar después del éxito para evitar múltiples envíos
                        disabled={loading || messageVariant === 'success'}
                    >
                        {loading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Enviando Solicitud...
                            </>
                        ) : (
                            'Solicitar Cambio de Email'
                        )}
                    </Button>
                    <div className="mt-2 text-center text-muted small">
                        Debe confirmar el cambio a través del enlace de verificación que enviaremos al nuevo email.
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}