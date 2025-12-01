import React, { useState, useEffect } from 'react'; // Eliminamos useContext y {session} ya que gestionaremos el estado aquí
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Container, Card, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { supabase } from '../services/supabaseClient'; 

export default function UpdatePasswordPage() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    
    // Nuevo estado: Indica si la sesión de recuperación está lista para el update.
    const [isSessionReady, setIsSessionReady] = useState(false); 
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageVariant, setMessageVariant] = useState('info');

    const newPassword = watch('newPassword');

    // 1. ESCUCHAR EL CAMBIO DE ESTADO DE AUTENTICACIÓN
    useEffect(() => {
        // En el momento de la carga de la página, Supabase lee los tokens de la URL
        // y establece la sesión. Esto dispara un evento 'SIGNED_IN' o 'RECOVERY'.
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                // Si la sesión existe y el evento es de inicio de sesión o recuperación,
                // marcamos la sesión como lista para la actualización.
                if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
                    console.log("Supabase event:", event, "Session is ready.");
                    setIsSessionReady(true);
                }
            }
        );

        // Intenta obtener la sesión inmediatamente por si la página ya cargó sin el listener
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setIsSessionReady(true);
            }
        });

        // Limpiar el listener al desmontar el componente
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);


    const onSubmit = async (data) => {
        setMessage('');
        setLoading(true);

        // Verificación final antes de intentar la actualización
        if (!isSessionReady) {
            setLoading(false);
            setMessage('Aún no se ha cargado la sesión de restablecimiento. Por favor, espere un momento o recargue la página.');
            setMessageVariant('warning');
            return;
        }

        try {
            // La llamada a updateUser ahora es segura porque hemos esperado el evento
            const { error } = await supabase.auth.updateUser({
                password: data.newPassword
            });

            if (error) {
                console.error("Error al actualizar la contraseña:", error);
                // Si la sesión expiró entre la carga y el envío del formulario:
                setMessage('❌ Error al actualizar la contraseña. Por favor, vuelva a solicitar el restablecimiento (la sesión de recuperación puede haber expirado).');
                setMessageVariant('danger');
                return;
            }

            setMessage('✅ Contraseña actualizada exitosamente. Redirigiendo al inicio de sesión...');
            setMessageVariant('success');

            // 2. Redirigir al usuario (y forzar la invalidación de la sesión temporal)
            setTimeout(() => {
                // Opcionalmente puedes forzar un signOut de la sesión temporal antes de redirigir
                supabase.auth.signOut().then(() => {
                    navigate('/'); 
                });
            }, 3000);

        } catch (err) {
            console.error("Error inesperado:", err);
            setMessage('❌ Error inesperado. Por favor, revise la consola.');
            setMessageVariant('danger');
        } finally {
            // El setLoading(false) se ejecutará si no hay una redirección inmediata
            if (!message.includes('Redirigiendo')) {
                setLoading(false);
            }
        }
    };

    return (
        <Container className="py-5 d-flex justify-content-center">
            <Card style={{ width: '400px' }} className="shadow-lg">
                <Card.Body>
                    <Card.Title className="text-center mb-4">Restablecer Contraseña</Card.Title>
                    
                    {message && <Alert variant={messageVariant}>{message}</Alert>}
                    
                    {/* Mostrar mensaje de carga si no está listo */}
                    {!isSessionReady && !message && (
                        <div className="text-center mb-3">
                            <Spinner animation="border" size="sm" className="me-2" />
                            Cargando sesión de seguridad...
                        </div>
                    )}

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
                                // Deshabilitar si no está listo
                                disabled={!isSessionReady || loading} 
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
                                // Deshabilitar si no está listo
                                disabled={!isSessionReady || loading}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.confirmPassword?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button 
                            className={`full-width-button ${messageVariant === 'danger' ? 'button-error' : ''}`}
                            variant="primary" 
                            type="submit" 
                            // Deshabilitar el botón hasta que la sesión esté lista
                            disabled={!isSessionReady || loading}
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