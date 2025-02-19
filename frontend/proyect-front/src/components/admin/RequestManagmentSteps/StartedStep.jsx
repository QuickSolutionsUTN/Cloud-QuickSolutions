import { useEffect, useState } from "react";
import { Form, Button, Modal, ListGroup, Row, Col } from "react-bootstrap";
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
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [showDateSelection, setShowDateSelection] = useState(false);

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

  // Llama a `mapProfessionsToItems` solo cuando ambos estados hayan cambiado
  useEffect(() => {
    if (items.length > 0 && profesiones.length > 0) {
      mapProfessionsToItems();
    }
  }, [items, profesiones]);


  const handleShow = () => {
    if (items.length === 0) {
      getApiResponse();
    }
    setShow(true);
    setShowDateSelection(true);
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

  const handleClose = () => setShow(false);

  const handleSubcrontractConfirmation = async () => {
    if (!selectedItem) {
      setError('Debe seleccionar un trabajador');
      return;
    }

    if (!startDate || !endDate) {
      setError('Debe seleccionar un rango de fechas');
      return;
    }

    console.log('Trabajador seleccionado:', selectedItem);
    console.log('Rango de fechas:', startDate, endDate);

    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];

    console.log("Fecha de inicio:", formattedStartDate);
    console.log("Fecha de fin:", formattedEndDate);

    // subcontractStep();
    // setShow(false);
    
  }





  return (
    <>
      <Form className="data-container">
        <div className="my-4"></div>
        <div className="row my-3">
          <div className="col-4">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              defaultValue={solicitud.emailSolicitante}
              readOnly
            ></Form.Control>
          </div>
          {/* <div className='col-4'>
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
            </div> */}
        </div>
        <div className="row my-3">
          <div className="col-4">
            <Form.Label>Servicio</Form.Label>
            <Form.Control
              type="text"
              defaultValue={solicitud.tipoServicio}
              readOnly
            ></Form.Control>
          </div>
          <div className="col-4">
            <Form.Label>Categoria</Form.Label>
            <Form.Control
              type="text"
              value={solicitud.categoria}
              readOnly
            ></Form.Control>
          </div>
          <div className="col-4">
            <Form.Label>Producto</Form.Label>
            <Form.Control
              type="text"
              value={solicitud.tipoDeProducto}
              readOnly
            ></Form.Control>
          </div>
        </div>
        <div className="my-4"></div>
        <div className="row">
          {solicitud.tipoServicio === "Reparacion" ? (
            <>
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
            </>
          ) : null}
          <div className="row my-3">
            <div className="col-4">
              <Form.Check
                type="checkbox"
                label="Con servicio de logistica"
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
          {error ? (
            <div>{error}</div>
          ) : (
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
          )}
          {showDateSelection && (
            <div className="mt-3 p-3 border rounded">
            <h5>Selecciona el período</h5>
            <div className="d-flex gap-2">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Fecha inicio"
                className="form-control"
                dateFormat="yyyy-MM-dd"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText="Fecha fin"
                className="form-control"
                dateFormat="yyyy-MM-dd"
              />
            </div>
          </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-primary" onClick={handleSubcrontractConfirmation}>
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
