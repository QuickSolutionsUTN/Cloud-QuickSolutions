import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Modal, Badge, ListGroup, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import AuthContext from "../../contexts/AuthContext.jsx";
import apiService from "../../services/axiosConfig.jsx";
import AddressCard from "./UserAddressCard.jsx";
import "./requestDetails.css";

export default function RequestDetails() {
  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id: solicitudId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  
  // Modales de confirmación
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const getBadgeVariant = (estado) => {
    const estados = {
      "Iniciada": "primary",
      "Revisada": "secondary",
      "Presupuestada": "info",
      "Aprobada": "success",
      "Finalizada": "dark",
      "Cancelada": "danger",
      "Rechazada": "danger",
    };
    return estados[estado] || "primary";
  };

  useEffect(() => {
    const fetchSolicitud = async () => {
      try {
        setLoading(true);
        const response = await apiService.getRequestById(solicitudId);
        setSolicitud(response.data);
      } catch (err) {
        console.error("Error al cargar solicitud:", err);
        toast.error("Error al cargar los detalles de la solicitud");
      } finally {
        setLoading(false);
      }
    };
    fetchSolicitud();
  }, [solicitudId]);

  const refetchSolicitud = async () => {
    try {
      const response = await apiService.getRequestById(solicitudId);
      setSolicitud(response.data);
    } catch (err) {
      console.error("Error al recargar solicitud:", err);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      try {
        const response = await apiService.getUserProfile(user.id);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [user]);

  const domicilio = userData.domicilio ?? null;

  const handleCancelar = async () => {
    setShowCancelModal(false);
    try {
      await apiService.cancelRequest(solicitudId);
      toast.success("Solicitud cancelada exitosamente");
      refetchSolicitud();
    } catch (err) {
      console.error("Error al cancelar:", err);
      toast.error(err.response?.data?.error || "Error al cancelar la solicitud");
    }
  };

  const handleAprobar = async () => {
    setShowAcceptModal(false);
    try {
      await apiService.updateRequestUser({ id: solicitudId, accion: "aprobar" });
      toast.success("Presupuesto aprobado exitosamente");
      refetchSolicitud();
    } catch (err) {
      console.error("Error al aprobar:", err);
      toast.error(err.response?.data?.error || "Error al aprobar la solicitud");
    }
  };

  const handleRechazar = async () => {
    setShowRejectModal(false);
    try {
      await apiService.updateRequestUser({ id: solicitudId, accion: "rechazar" });
      toast.success("Presupuesto rechazado");
      refetchSolicitud();
    } catch (err) {
      console.error("Error al rechazar:", err);
      toast.error(err.response?.data?.error || "Error al rechazar la solicitud");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No especificada";
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderAdminMessages = () => {
    if (!solicitud.resumen) return null;

    const estadoActual = solicitud.estado;

    if (estadoActual === "Cancelada" || estadoActual === "Rechazada") {
      return (
        <Alert variant="danger" className="mb-4">
          <div className="d-flex align-items-start">
            <i className="bi bi-exclamation-triangle-fill me-3 mt-1"></i>
            <div className="flex-grow-1">
              <Alert.Heading as="h6" className="mb-2">
                {estadoActual === "Cancelada" ? "Motivo de cancelación" : "Motivo de rechazo"}
              </Alert.Heading>
              <p className="mb-2">{solicitud.resumen}</p>
              {solicitud.fechaCancelada && (
                <small className="text-muted">
                  <i className="bi bi-calendar me-1"></i>
                  {formatDate(solicitud.fechaCancelada)}
                </small>
              )}
              </div>
          </div>
        </Alert>
      );
    }

    // Mensaje de finalización
    if (estadoActual === "Finalizada") {
      return (
        <Alert variant="success" className="mb-4">
          <div className="d-flex align-items-start">
            <i className="bi bi-check-circle-fill me-3 mt-1"></i>
            <div className="flex-grow-1">
              <Alert.Heading as="h6" className="mb-2">
                Comentarios de finalización
              </Alert.Heading>
              <p className="mb-2">{solicitud.resumen}</p>
            </div>
          </div>
        </Alert>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!solicitud) {
    return (
      <div className="alert alert-danger" role="alert">
        Solicitud no encontrada
      </div>
    );
  }

  const estadoActual = solicitud.estado;
  const puedeAprobarRechazar = estadoActual === "Presupuestada";
  const puedeCancelar = estadoActual === "Iniciada";

  return (
    <div className="request-details-container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h3>
          Solicitud #{solicitudId}
          <Badge className="ms-3" bg={getBadgeVariant(estadoActual)}>
            {estadoActual}
          </Badge>
        </h3>
        <Button variant="outline-secondary" onClick={() => navigate("/users/requests")}>
          <i className="bi bi-arrow-left me-2"></i>Volver
        </Button>
      </div>

      {/* Mensajes del administrador */}
      {renderAdminMessages()}

      {/* Información de presupuesto si aplica */}
      {(["Presupuestada", "Aprobada", "Finalizada"].includes(estadoActual)) && (
        <div className="card mb-4 border-success">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <h4 className="text-success mb-0">
                  <i className="bi bi-currency-dollar me-2"></i>
                  Monto: ${solicitud.monto}
                </h4>
              </div>
              <div className="text-end">
                {estadoActual === "Finalizada" ? (
                  <span className="text-muted">
                    <i className="bi bi-calendar-check me-2"></i>
                    Finalizada: {formatDate(solicitud.fechaFinalizada)}
                  </span>
                ) : solicitud.fechaEstimada && (
                  <span className="text-muted">
                    <i className="bi bi-calendar me-2"></i>
                    Fecha Estimada: {formatDate(solicitud.fechaEstimada)}
                  </span>
                )}
              </div>
              {puedeAprobarRechazar && (
                <div className="d-flex gap-2">
                  <Button variant="success" onClick={() => setShowAcceptModal(true)}>
                    <i className="bi bi-check-circle me-2"></i>Aprobar
                  </Button>
                  <Button variant="danger" onClick={() => setShowRejectModal(true)}>
                    <i className="bi bi-x-circle me-2"></i>Rechazar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Datos de la solicitud */}
      <Form className="data-container">
        <div className="row my-3">
          <div className="col-md-6 col-lg-4">
            <Form.Label className="fw-bold">Email</Form.Label>
            <Form.Control type="text" value={solicitud.emailSolicitante || ""} readOnly />
          </div>
          <div className="col-md-6 col-lg-4">
            <Form.Label className="fw-bold">Fecha de Solicitud</Form.Label>
            <Form.Control type="text" value={formatDate(solicitud.fechaGeneracion)} readOnly />
          </div>
        </div>

        <div className="row my-3">
          <div className="col-md-4">
            <Form.Label className="fw-bold">Servicio</Form.Label>
            <Form.Control type="text" value={solicitud.tipoServicio || ""} readOnly />
          </div>
          <div className="col-md-4">
            <Form.Label className="fw-bold">Categoría</Form.Label>
            <Form.Control type="text" value={solicitud.categoria || ""} readOnly />
          </div>
          <div className="col-md-4">
            <Form.Label className="fw-bold">Producto</Form.Label>
            <Form.Control type="text" value={solicitud.producto || ""} readOnly />
          </div>
        </div>

        {/* Descripción del problema (solo para reparación) */}
        {(solicitud.tipoServicio === "Reparacion" || solicitud.tipoServicio === "Reparación") && solicitud.descripcion && (
          <div className="row my-3">
            <div className="col-12">
              <Form.Group controlId="descripcion">
                <Form.Label className="fw-bold">Descripción del problema</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={solicitud.descripcion}
                  readOnly
                  style={{ resize: "vertical" }}
                />
              </Form.Group>
            </div>
          </div>
        )}

        {/* Diagnóstico técnico */}
        {solicitud.diagnosticoTecnico && (
          <div className="row my-3">
            <div className="col-12">
              <Form.Group controlId="diagnostico">
                <Form.Label className="fw-bold">
                  <i className="bi bi-tools me-2"></i>Diagnóstico Técnico
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={solicitud.diagnosticoTecnico}
                  readOnly
                  style={{ resize: "vertical" }}
                />
              </Form.Group>
            </div>
          </div>
        )}

        {/* Checklist de mantenimiento */}
        {solicitud.mantenimiento?.checklist && solicitud.mantenimiento.checklist.length > 0 && (
          <Form.Group className="my-3" controlId="checklist">
            <Form.Label className="fw-bold">
              <i className="bi bi-list-check me-2"></i>Checklist de Mantenimiento
            </Form.Label>
            <ListGroup>
              {solicitud.mantenimiento.checklist.map((item) => (
                <ListGroup.Item key={item.id}>
                  <i className="bi bi-check-circle text-success me-2"></i>
                  {item.descripcion}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Form.Group>
        )}

        <hr />

        {/* Logística */}
        {solicitud.con_logistica ? (
          <div className="mb-3">
            <h5 className="mb-3">
              <i className="bi bi-truck me-2"></i>Con servicio a domicilio
            </h5>
            <AddressCard
              street={domicilio?.calle || "No especificado"}
              number={domicilio?.numero || ""}
              province={domicilio?.provincia || "No especificado"}
              locality={domicilio?.localidad_nombre || "No especificado"}
              zipCode={domicilio?.codigo_postal || "No especificado"}
              floor={domicilio?.piso || ""}
              department={domicilio?.departamento || ""}
              noHover={true}
            />
          </div>
        ) : (
          <div className="mb-3">
            <h5>
              <i className="bi bi-shop me-2"></i>Sin servicio a domicilio
            </h5>
            <p className="text-muted">El cliente llevará el producto al local.</p>
          </div>
        )}
      </Form>

      {/* Botón de cancelar */}
      {puedeCancelar && (
        <div className="d-flex justify-content-end mt-4">
          <Button variant="outline-danger" onClick={() => setShowCancelModal(true)}>
            <i className="bi bi-x-circle me-2"></i>Cancelar Solicitud
          </Button>
        </div>
      )}

      {/* Modal Aprobar */}
      <Modal show={showAcceptModal} onHide={() => setShowAcceptModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Aprobación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas aprobar el presupuesto de <strong>${solicitud.monto}</strong>?</p>
          {solicitud.fechaEstimada && (
            <p className="text-muted">
              Fecha estimada de entrega: {formatDate(solicitud.fechaEstimada)}
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAcceptModal(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleAprobar}>
            <i className="bi bi-check-circle me-2"></i>Sí, aprobar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Rechazar */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Rechazo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas rechazar el presupuesto?</p>
          <p className="text-muted">Esta acción no se puede deshacer.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleRechazar}>
            <i className="bi bi-x-circle me-2"></i>Sí, rechazar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Cancelar Solicitud */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cancelar Solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas cancelar esta solicitud?</p>
          <p className="text-muted">Esta acción no se puede deshacer.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            No, volver
          </Button>
          <Button variant="danger" onClick={handleCancelar}>
            <i className="bi bi-x-circle me-2"></i>Sí, cancelar solicitud
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}