import { useEffect, useState } from "react";
import {
  Form,
  Button,
  Modal,
  ListGroup,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AnimatedButton from "../../common/AnimatedButton";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare } from "@fortawesome/free-solid-svg-icons";
import "react-datepicker/dist/react-datepicker.css";
import "./StartedStep.css";

function StartedStep({ solicitud, nextStep, cancelStep }) {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [trabajadoresFiltrados, setTrabajadoresFiltrados] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  if (!solicitud) {
    return <div>Cargando...</div>;
  }

  const handleNextStep = (e) => {
    if (e) e.preventDefault();
    nextStep();
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  const handleClose = () => {
    setSelectedItem(null);
    setError(null);
    setShow(false);
  };

  const adjustTextareaHeight = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1 // Retraso entre cada hijo
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
    >
      <Form className="started-step-container">
        <motion.div variants={item} className="row">
          <div className="row">
            {solicitud.tipoServicio === "Reparación" ? (
              <div className="col-12">
                <Form.Group controlId="description">
                  <Form.Label className="fw-bold">Descripcion del problema</Form.Label>
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
            ) : (
              <div className="col-12">
                <div className="col-12 mb-3">
                  <div className="section-label mb-2">Descripción del mantenimiento</div>

                  <div className="description-card">
                    {solicitud.mantenimiento?.descripcion || "Sin descripción proporcionada."}
                  </div>
                </div>
                <div className="mt-2">
                  <h6 className="section-label mb-2">Checklist de Mantenimiento Preventivo</h6>

                  <div className="bg-white rounded border" style={{ overflow: 'hidden' }}>
                    {solicitud.mantenimiento?.checklist?.map((item) => (

                      <div key={item.id} className="checklist-item">

                        <FontAwesomeIcon icon={faSquare} className="check-icon" />

                        <div className="d-flex flex-column flex-grow-1">
                          <span className="text-dark fw-medium">{item.descripcion}</span>
                        </div>

                        {item.obligatorio && (
                          <span className="badge bg-light text-secondary border ms-2">
                            Obligatorio
                          </span>
                        )}
                      </div>

                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="my-4"></div>
        </motion.div>
      </Form>
      <motion.div variants={item} className="buttons-container">
        <div className="buttons-container">
          <AnimatedButton className="cancel" variant="danger" onClick={cancelStep}>
            Cancelar
          </AnimatedButton>
          <AnimatedButton variant="success"
            type="button"
            onClick={handleNextStep}>
            Aceptar servicio
          </AnimatedButton>
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
                        <div>
                          <strong>
                            {item.nombre} {item.apellido}
                          </strong>
                        </div>
                        <div>Email: {item.email}</div>
                        <div>Edad: {item.edad}</div>
                        <div>Profesión: {item.profesionNombre}</div>
                      </Col>
                      <Col md={2} className="d-flex align-items-center">
                        <Button variant="link" size="sm">
                          Ver más
                        </Button>
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
                <Form.Group controlId="startDate">
                  <Form.Label>Fecha inicio</Form.Label>
                  <Form.Control
                    type="date"
                    name="fechaInicio"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="endDate">
                  <Form.Label>Fecha inicio</Form.Label>
                  <Form.Control
                    type="date"
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

            <Button variant="outline-danger" onClick={handleClose}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      </motion.div>
    </motion.div>
  );
}

export default StartedStep;
