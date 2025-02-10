import { useEffect, useState } from "react";
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useBackendURL } from '../../../contexts/BackendURLContext.jsx';
import { useParams } from 'react-router-dom';
//import "./reviewedStep.css"

function BudgetedStep(){
    const [solicitud, setSolicitud] = useState(null);
    const { id: solicitudId } = useParams();
    const backendURL = useBackendURL();
    const navigate = useNavigate();
    const [fechaFormateada, setFechaFormateada] = useState('');
    const [idCategoria, setIdCategoria] = useState(null);

    const handleNextStep = (event) => {
    event.preventDefault();
    nextStep();
    };

    useEffect(() => {
    const fetchSolicitudDetails = async () => {
        try {
        console.log('Fetching solicitud details...', backendURL);
        const response = await axios.get(`${backendURL}/api/solicitud/${solicitudId}`);
        console.log('Solicitud details:', response.data);
        setSolicitud(response.data);
        const fechaGeneracion = new Date(response.data.fechaGeneracion);
        const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
        setFechaFormateada(fechaGeneracion.toLocaleDateString('es-ES', opciones));
        } catch (error) {
        console.error('Error fetching solicitud details:', error);
        }
    }
    fetchSolicitudDetails();
    }, [solicitudId]);

    if (!solicitud) {
        return <div>Cargando...</div>;
    }

    return (
        <>
            <h2> Esperando respuesta del cliente</h2>
            <Form className='reviewed-step-form' onSubmit={handleNextStep}>
            <div className='row'>
            <div className='col-diagnostico'>
                <Form.Group controlId='diagnostico'>
                <Form.Label>Diagnostico</Form.Label>
                <Form.Control
                    as='textarea'
                    rows={3}
                    type='text'
                    placeholder='Ingrese el diagnostico'
                    readOnly
                />
                </Form.Group>
            </div>
            <div className='col-monto'>
                <Form.Group controlId='monto'>
                <Form.Label>Monto</Form.Label>
                <Form.Control
                    type='number'
                    placeholder='Ingrese el monto'
                    readOnly
                />
                </Form.Group>
            </div>
            </div>
        </Form>
        </>
    );
    }

    export default BudgetedStep;