import { useEffect, useState } from "react";
import { Form, Button, Modal, ListGroup, Row, Col, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import envioService from "../../../services/apiEnviosService.jsx";
import apiReparacionExterna from "../../../services/apiBolsaTrabajoService.jsx";

import "./StartedStep.css";

function StartedStep({ solicitud, nextStep, subcontractStep, cancelStep }) {

  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [items, setItems] = useState([]);
  const [profesiones, setProfesiones] = useState([]);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [trabajadoresFiltrados, setTrabajadoresFiltrados] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [postApiExito, setPostApiExito] = useState(false);

  if (!solicitud) { return <div>Cargando...</div>; }

  const handleNextStep = async () => {
    console.log("Solicitud:", solicitud);
    if (solicitud.conLogistica) {
      const nroSeguimiento = await solicitarEnvio(solicitud.envio);
      if (!nroSeguimiento) {
        alert(
          "Error al conectarse con el servicio de envios. Intente nuevamente mas tarde"
        );
        return;
      }
      solicitud.envio.nroSeguimiento = nroSeguimiento;
    }
    nextStep();
  };

  const solicitarEnvio = async (data) => {
    const uuid_admin = "cda6ad47-e784-4b29-9b34-f680b21e1563";
    const envioData = {
      descripcion: "Envio de paquete",
      hora: "12:00",
      pesoGramos: 1000,
      reserva: true,
      origen: {
        calle: data.calle,
        numero: data.numero,
        piso: data?.piso || 0,
        depto: data?.departamento || null,
        descripcion: "Casa",
        localidadID: data.idLocalidad,
      },
      destino: {
        calle: "Av del petroleo",
        numero: 417,
        piso: 0,
        depto: null,
        descripcion: "UTN la mas grande",
        localidadID: 68,
      },
      cliente: uuid_admin,
    };

    try {
      console.log("Solicitando envio...", envioData);
      const response = await envioService.postEnvio(envioData);
      console.log("Envio solicitado:", response);
      const nroSeguimiento = response.nroSeguimiento;
      return nroSeguimiento;
    } catch (error) {
      console.error("Error solicitando envio:", error);
    }
  };

  const getApiResponse = async () => {
    try {
      const [trabajadores, profesiones] = await Promise.all([
        apiReparacionExterna.getTrabajadores(),
        apiReparacionExterna.getProfesiones(),
      ]);

      console.log('Trabajadores obtenidos:', trabajadores);
      console.log('Profesiones obtenidas:', profesiones);

      setItems(trabajadores);
      setProfesiones(profesiones);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (items.length > 0 && profesiones.length > 0) {
      mapProfessionsToItems();
    }
  }, [items, profesiones]);


  const handleShow = () => {
    if (items.length === 0) { getApiResponse(); }
    setShow(true);
  }

  const mapProfessionsToItems = () => {
    console.log('Mapeando profesiones a items...');
    const updatedItems = items.map(item => {
      const profession = profesiones.find(prof => prof.idprofesion === item.idprofesion);
      console.log('Profesion encontrada:', profession);
      return {
        ...item,
        profesionNombre: profession ? profession.nombre : "Desconocido"
      };
    });

    console.log('Items actualizados:', updatedItems);
    setTrabajadoresFiltrados(updatedItems);
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  const handleClose = () => {
    setSelectedItem(null);
    setError(null);
    setShow(false);
  }

  const handleSubcrontractFinish = async () => {

    if (!selectedItem) {
      console.log('Debe seleccionar un trabajador');
      setError('Debe seleccionar un trabajador');
      return;
    }

    if (!startDate || !endDate) {
      setError('Debe seleccionar un rango de fechas');
      return;
    }
    setError(null);


    const solicitudData = {
      empresa: "QuickSolutions",
      fecha_inicio: startDate,
      fecha_fin: endDate,
      idtrabajadores: [selectedItem.idtrabajador],
    };
    const success = await postSolicitudTrabajo(solicitudData);
    if (!success) {
      console.log('Error al solicitar trabajo');
      alert('Error al solicitar trabajo');
      return;
    }
    subcontractStep();
    setShow(false);

  }

  const postSolicitudTrabajo = async (solicitudData) => {
    try {
      console.log('Solicitando trabajo...', solicitudData);
      const response = await apiReparacionExterna.postSolicitud(solicitudData);
      console.log('Trabajo solicitado:', response);
      solicitud.IdSolicitudExterna = response.solicitud.idsolicitud;
      return true;
    } catch (error) {
      console.error('Error solicitando trabajo:', error);
    }
  }

  const adjustTextareaHeight = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <>
      <Form className="data-container">
        <div className="row">
          {solicitud.tipoServicio === "Reparacion" ? (
            <div className="col-12">
              <Form.Group controlId="description">
                <Form.Label>Descripcion del problema</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  type="text"
                  value={solicitud.descripcion}
                  readOnly
                  style={{ resize: "vertical" }}
                />
              </Form.Group>
            </div>
          ) : <div className="col-12">
            <Form.Group controlId="description">
              <Form.Label className="fw-bold">Descripcion del mantenimiento</Form.Label>
              <Form.Control
                as="textarea"
                type="text"
                value={solicitud.mantenimiento?.descripcion}
                readOnly
                style={{ resize: 'none', overflow: 'hidden' }}
                onInput={adjustTextareaHeight}
              />
            </Form.Group>
          </div>}
        </div>
        <div className="my-4"></div>
      </Form>
      <div className="buttons-container">
        <Button className="cancel" variant="danger" onClick={cancelStep}>
          Cancelar
        </Button>
        <Button className="subcontract" variant="warning" onClick={handleShow}>
          Subcontratar
        </Button>
        <Button variant="success" onClick={handleNextStep}>
          Aceptar servicio
        </Button>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Lista de Items</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <ListGroup>
            {trabajadoresFiltrados.length > 0 ? (
              trabajadoresFiltrados.map((item, index) => (
                <ListGroup.Item
                  key={index}
                  action
                  active={selectedItem === item}
                  onClick={() => handleSelectItem(item)}
                >
                  <Row>
                    <Col md={8}>
                      <div><strong>{item.nombre} {item.apellido}</strong></div>
                      <div>Email: {item.email}</div>
                      <div>Edad: {item.edad}</div>
                      <div>Profesión: {item.profesionNombre}</div>
                    </Col>
                    <Col md={2} className="d-flex align-items-center">
                      <Button variant="link" size="sm">Ver más</Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))
            ) : (
              <div>Cargando...</div>
            )}
          </ListGroup>
          <div className="mt-3 p-3 border rounded">
            <h5>Selecciona el período</h5>
            <div className="d-flex gap-2">

              <Form.Group controlId='startDate'>
                <Form.Label>Fecha inicio</Form.Label>
                <Form.Control
                  type='date'
                  name="fechaInicio"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId='endDate'>
                <Form.Label>Fecha inicio</Form.Label>
                <Form.Control
                  type='date'
                  name="fechaFin"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </Form.Group>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-primary" onClick={handleSubcrontractFinish}>
            Solicitar trabajador
          </Button>
          <Button variant="outline-danger" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default StartedStep;
