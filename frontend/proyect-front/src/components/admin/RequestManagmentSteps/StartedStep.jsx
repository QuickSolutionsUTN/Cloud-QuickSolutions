import { useEffect, useState } from "react";
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useBackendURL } from '../../../contexts/BackendURLContext.jsx';
import { useParams } from 'react-router-dom';
import envioService from "../../../services/apiEnviosService.jsx";

import "./StartedStep.css";

function StartedStep({ nextStep, subcontractStep, cancelStep }) {
  const [solicitud, setSolicitud] = useState(null);
  const { id: solicitudId } = useParams();
  const backendURL = useBackendURL();
  const [fechaFormateada, setFechaFormateada] = useState('');
  const [idCategoria, setIdCategoria] = useState(null);
  const navigate = useNavigate();

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

  const handleNextStep= () => {
    solicitarEnvio(solicitud.envio);
  }

  const solicitarEnvio = async (data) => {
    const uuid_admin='cda6ad47-e784-4b29-9b34-f680b21e1563';
    const envioData = {
      descripcion: "Envio de paquete",
      hora: "12:00",
      pesoGramos: 1000,
      reserva:true,
      origen: {
        calle: data.calle,
        numero: data.numero,
        piso: data?.piso || 0,
        depto: data?.departamento || null,
        descripcion: "Casa",
        localidadID: data.idLocalidad
      },
      destino: {
        calle: "Av del petroleo",
        numero: 417,
        piso: 0,
        depto: null,
        descripcion: "UTN la mas grande",
        localidadID: 68
      },
      cliente: uuid_admin
    };

    try {
      console.log('Solicitando envio...' ,envioData);
      const response = await envioService.postEnvio(envioData);
      console.log('Envio solicitado:', response);
      //navigate('/admin/solicitudes');
    } catch (error) {
      console.error('Error solicitando envio:', error);
    }
  }




  return (
    <>
      <Form className='data-container'>
        <div className="my-4"></div>
          <div className='row my-3'>
            <div className='col-4'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='text'
                defaultValue={solicitud.emailSolicitante}
                readOnly
              >
              </Form.Control>
            </div>
            <div className='col-4'>
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type='text'
                defaultValue={solicitud.apellidoSolicitante}
                readOnly
              >
              </Form.Control>
            </div>
            <div className='col-4'>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type='text'
                defaultValue={solicitud.nombreSolicitante}
                readOnly
              >
              </Form.Control>
            </div>
          </div>
          <div className='row my-3'>
            <div className='col-4'>
              <Form.Label>Servicio</Form.Label>
              <Form.Control
                type='text'
                defaultValue={solicitud.tipoServicio}
                readOnly
              >
              </Form.Control>
            </div>
            <div className='col-4'>
              <Form.Label>Categoria</Form.Label>
              <Form.Control
                type='text'
                value={solicitud.categoria}
                readOnly
              >
              </Form.Control>
            </div>
            <div className='col-4'>
              <Form.Label>Producto</Form.Label>
              <Form.Control
                type='text'
                value={solicitud.tipoDeProducto}
                readOnly
              >
              </Form.Control>
            </div>
          </div>
          <div className="my-4"></div>
          <div className='row'>
            <div className='col-12'>
              <Form.Group controlId='description'>
                <Form.Label>Descripcion del problema</Form.Label>
                <Form.Control
                  as='textarea'
                  rows={3}
                  type='text'
                  value={solicitud.descripcion}
                  readOnly
                  style={{ resize: 'vertical' }}
                />
              </Form.Group>
            </div>
            <div className='row my-3'>
            <div className='col-4'>
              <Form.Check
                type='checkbox'
                label='Con servicio de logistica'
                checked={solicitud.conLogistica}
                readOnly
              />
            </div>
          </div>
          </div>
          <div className="my-4"></div>
      </Form>
      <div className="buttons-container">
        <Button className="cancel" variant="danger" onClick={cancelStep}>
          Cancelar
        </Button>
        <Button className="subcontract" variant="warning" onClick={subcontractStep}>
          Subcontratar
        </Button>
        <Button variant="success" onClick={handleNextStep}>
          Aceptar servicio
        </Button>
      </div>
    </>
  );
}

export default StartedStep;