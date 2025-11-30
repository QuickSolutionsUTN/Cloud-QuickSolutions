import { useEffect, useState } from "react";
// react-bootstrap components
import {
  Spinner,
  Card,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faUser } from "@fortawesome/free-regular-svg-icons";
import { faBolt, faScrewdriverWrench, faSquare, faX, faCheck, faDollarSign, faHourglass, faTruck, faPercent } from "@fortawesome/free-solid-svg-icons";
import apiService from "../services/axiosConfig";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, ArcElement } from "chart.js";
import "./adminDashboardPage.css";


export default function AdminDashboardPage() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [stateCount, setStateCount] = useState([0, 0, 0, 0, 0, 0]);
  const [serviceTypeCount, setServiceTypeCount] = useState([0, 0]);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [aprobedBudgetsCount, setAprobedBudgetsCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [rejectedBudgetsCount, setRejectedBudgetsCount] = useState(0);
  const [deliveryServiceCount, setDeliveryServiceCount] = useState(0);
  const [successfullMaintenances, setSuccessfullMaintenances] = useState(0);
  const [successfullRepairs, setSuccessfullRepairs] = useState(0);
  const [productosCount, setProductosCount] = useState(0);
  const [usuariosCount, setUsuariosCount] = useState(0);
  const [mantenimientosCount, setMantenimientosCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Una sola llamada optimizada al backend
        const response = await apiService.getDashboardStats();
        const { solicitudes, usuariosCount, productosCount, mantenimientosCount } = response.data;
        
        setSolicitudes(solicitudes);
        setUsuariosCount(usuariosCount);
        setProductosCount(productosCount);
        setMantenimientosCount(mantenimientosCount);
        
      } catch (error) {
        console.error("Error al obtener datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    if (solicitudes.length === 0) return;

    // Conteo por estado
    const count = [0, 0, 0, 0, 0, 0]; // Iniciada, Revisada, Presupuestada, Aprobada, Finalizada, Cancelada
    solicitudes.forEach((solicitud) => {
      const estado = solicitud.estado;
      switch (estado) {
        case "Iniciada":
          count[0]++;
          break;
        case "Revisada":
          count[1]++;
          break;
        case "Presupuestada":
          count[2]++;
          break;
        case "Aprobada":
          count[3]++;
          break;
        case "Finalizada":
          count[4]++;
          break;
        case "Cancelada":
          count[5]++;
          break;
        default:
          break;
      }
    });
    setStateCount(count);

    // Conteo por tipo de servicio
    const typeCount = [0, 0]; // Reparación, Mantenimiento
    solicitudes.forEach((solicitud) => {
      const tipo = solicitud.tipoServicio?.toLowerCase();
      if (tipo === "reparacion" || tipo === "reparación") {
        typeCount[0]++;
      } else if (tipo === "mantenimiento") {
        typeCount[1]++;
      }
    });
    setServiceTypeCount(typeCount);

    // Otras métricas
    let aprobedBudget = 0;
    let pending = 0;
    let rejectedCount = 0;
    let deliverySCount = 0;
    let successfullM = 0;
    let successfullR = 0;
    let earnings = 0;

    solicitudes.forEach((solicitud) => {
      // Presupuestos aprobados
      if (solicitud.fechaAprobada) aprobedBudget++;
      
      // Pendientes de finalización (aprobadas pero no finalizadas)
      if (solicitud.fechaAprobada && !solicitud.fechaFinalizada && solicitud.estado !== "Cancelada") {
        pending++;
      }
      
      // Presupuestos rechazados (canceladas después de presupuestar)
      if (solicitud.fechaPresupuestada && solicitud.estado === "Cancelada") {
        rejectedCount++;
      }
      
      // Con servicio a domicilio
      if (solicitud.conLogistica) deliverySCount++;
      
      // Finalizados por tipo
      const tipoServicio = solicitud.tipoServicio?.toLowerCase();
      if (solicitud.fechaFinalizada) {
        if (tipoServicio === "mantenimiento") successfullM++;
        if (tipoServicio === "reparacion" || tipoServicio === "reparación") successfullR++;
        earnings += solicitud.monto || 0;
      }
    });

    setAprobedBudgetsCount(aprobedBudget);
    setPendingCount(pending);
    setRejectedBudgetsCount(rejectedCount);
    setDeliveryServiceCount(deliverySCount);
    
    // Calcular porcentajes (evitar división por cero)
    setSuccessfullMaintenances(typeCount[1] > 0 ? (successfullM * 100) / typeCount[1] : 0);
    setSuccessfullRepairs(typeCount[0] > 0 ? (successfullR * 100) / typeCount[0] : 0);
    setMonthlyEarnings(earnings);

  }, [solicitudes]);


  // Registrar los componentes necesarios
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, ArcElement);


  const dataBar1 = {
    labels: ["Iniciada", "Revisada", "Presupuestada", "Aprobada", "Finalizada", "Cancelada"],
    datasets: [
      {
        data: [stateCount[0], stateCount[1], stateCount[2], stateCount[3], stateCount[4], stateCount[5]],
        backgroundColor: [
          "#007BFF",
          "#6F42C1",
          "#D4AC0D",
          "#28A745",
          "#FD7E14",
          "#DC3545",
        ],
        borderColor: [
          "rgba(0, 86, 179, 1)",  // Iniciada - Azul oscuro
          "rgba(88, 35, 127, 1)",  // Revisada - Morado intenso
          "rgba(155, 111, 0, 1)",  // Finalizada - Amarillo oscuro
          "rgba(20, 121, 45, 1)",  // Aprobada - Verde más oscuro
          "rgba(199, 87, 0, 1)",   // Presupuestada - Naranja oscuro
          "rgba(160, 28, 40, 1)"   // Cancelada - Rojo oscuro
        ],
        borderWidth: 1,
      },
    ],
  };



  const dataPie = {
    labels: ["Reparaciones", "Mantenimiento"],
    datasets: [
      {
        label: "Estado de Solicitudes",
        data: [serviceTypeCount[0], serviceTypeCount[1]],
        backgroundColor: [
          "#FF6F61",
          "#A7C7E7",
        ],
        borderColor: [
          "#D04B3C  ",
          "#5B8FA6  ",
        ],
        borderWidth: 1,
      },
    ],
  };

  const optionsBar1 = {
    indexAxis: "x",
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { enabled: true },
    },
    scales: {
      x: { ticks: { font: { size: 14, weight: 'bold', }, }, },
      y: { ticks: { font: { size: 14, }, }, },
    },
  };


  const optionsPie = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false, // Ocultamos la leyenda porque ya mostramos los datos a la izquierda
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
      <Container fluid className="admin-dashboard">
      {loading ? (
          <Spinner animation="border" />
        ) : (
          <>
        <Row className="m-2 d-flex flex-row">
          <div className="title"><h2>Dashboard</h2></div>
        </Row>
        <Row className="m-2 d-flex flex-row">
          <Col lg="2" sm="6">
            <Card className="p-2 card-stats h-100">
              <Card.Body className="text-center">
                <div className="d-flex flex-column">
                  <div className="icon-big d-flex justify-content-end">
                    <FontAwesomeIcon icon={faFile} size="lg" className="custom-text-primary" />
                  </div>
                  <div className="numbers"><h3>{solicitudes.length}</h3></div>
                  <div className="title"><h6>Solicitudes</h6></div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="2" sm="6">
            <Card className="p-2 card-stats h-100">
              <Card.Body className="text-center">
                <div className="d-flex flex-column">
                  <div className="icon-big d-flex justify-content-end">
                    <FontAwesomeIcon icon={faDollarSign} size="lg" className="text-success" />
                  </div>
                  <div className="numbers"><h3>$ {monthlyEarnings}</h3></div>
                  <div className="title"><h6>Ganancias Mensuales</h6></div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="2" sm="6">
            <Card className="p-2 card-stats h-100">
              <Card.Body className="text-center">
                <div className="d-flex flex-column">
                  <div className="icon-big d-flex justify-content-end">
                    <FontAwesomeIcon icon={faCheck} size="lg" className="text-success" />
                  </div>
                  <div className="numbers"><h3>{aprobedBudgetsCount}</h3></div>
                  <div className="subtitle"><h6>Presupuestos aprobados</h6></div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="2" sm="6">
            <Card className="p-2 card-stats">
              <Card.Body className="text-center">
                <div className="d-flex flex-column">
                  <div className="icon-big d-flex justify-content-end">
                    <FontAwesomeIcon icon={faX} size="lg" className="text-danger" />
                  </div>
                  <div className="numbers"><h3>{rejectedBudgetsCount}</h3></div>
                  <div className="subtitle"><h6>Presupuestos rechazados</h6></div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="2" sm="6">
            <Card className="p-2 card-stats h-100">
              <Card.Body className="text-center">
                <div className="d-flex flex-column">
                  <div className="icon-big d-flex justify-content-end">
                    <FontAwesomeIcon icon={faHourglass} size="lg" className="text-primary" />
                  </div>
                  <div className="numbers"><h3>{pendingCount}</h3></div>
                  <div className="subtitle"><h6>Solicitudes pendientes de finalizacion</h6></div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="2" sm="6">
            <Card className="p-2 card-stats h-100">
              <Card.Body className="text-center">
                <div className="d-flex flex-column">
                  <div className="icon-big d-flex justify-content-end">
                    <FontAwesomeIcon icon={faUser} size="lg" className="custom-text-primary" />
                  </div>
                  <div className="numbers"><h3>{usuariosCount}</h3></div>
                  <div className="title"><h6>Usuarios</h6></div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="m-2 d-flex flex-row">
          <Col md="6" sm="6" className="d-flex flex-column">
            <Card className="maintenance-progress h-100 flex-grow-1">
              <Card.Body>
                <div className="d-flex flex-row justify-content-cetner title mb-2">
                  <span><h5>Mantenimientos exitosos</h5></span>
                </div>
                <div className="d-flex flex-row justify-content-center w-100">
                  <div className="progress w-100">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${Math.round(successfullMaintenances)}%` }}
                      aria-valuenow={Math.round(successfullMaintenances)}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {Math.round(successfullMaintenances)}%
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md="6" sm="6" className="d-flex flex-column">
            <Card className="repair-progress h-100 flex-grow-1">
              <Card.Body>
                <div className="d-flex flex-row justify-content-cetner title mb-2">
                  <span><h5>Reparaciones exitosas</h5></span>
                </div>
                <div className="d-flex flex-row justify-content-center w-100">
                  <div className="progress w-100">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${Math.round(successfullRepairs)}%` }}
                      aria-valuenow={Math.round(successfullRepairs)}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {Math.round(successfullRepairs)}%
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="m-2 d-flex flex-row">
          <Col md="6" sm="6" className="d-flex flex-column" >
            <Card className="mt-2 h-100 flex-grow-1">
              <Card.Header>
                <Card.Title as="h5" className="text-center">Estado solicitudes</Card.Title>
              </Card.Header>
              <Card.Body>
                <Bar data={dataBar1} options={optionsBar1} />
              </Card.Body>
            </Card>
          </Col>
          <Col md="6" sm="6" className="d-flex flex-column">
            <Row className="mt-2 d-flex flex-row">
              <Col lg="8" sm="6">
                <Card className="h-100 flex-grow-1">
                  <Card.Header className="text-center">
                    <Card.Title as="h5">Tipo de solicitud</Card.Title>
                  </Card.Header>
                  <Card.Body className="d-flex flex-row justify-content-around align-items-center">
                    <div className="d-flex flex-column align-items-start">
                      <div className="d-flex align-items-center mb-2">
                        <FontAwesomeIcon className="me-2" size="lg" style={{ color: "#FF6F61" }} icon={faSquare} />
                        <span className="me-2">Reparaciones:</span>
                        <strong>{serviceTypeCount[0]}</strong>
                      </div>
                      <div className="d-flex align-items-center">
                        <FontAwesomeIcon className="me-2" size="lg" style={{ color: "#A7C7E7" }} icon={faSquare} />
                        <span className="me-2">Mantenimientos:</span>
                        <strong>{serviceTypeCount[1]}</strong>
                      </div>
                    </div>
                    <div style={{ width: "150px", height: "150px" }}>
                      <Pie data={dataPie} options={optionsPie} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg="4" sm="6">
                <Card className="p-2 card-stats h-100">
                  <Card.Body className="text-center">
                    <div className="d-flex flex-column justify-content-center">
                      <div className="icon-big d-flex justify-content-end">
                        <FontAwesomeIcon icon={faScrewdriverWrench} size="lg" className="custom-text-primary" />
                      </div>
                      <div className="numbers"><h3>{productosCount}</h3></div>
                      <div className="title"><h6>Productos en el catálogo</h6></div>
                      <hr />
                      <div className="icon-big d-flex justify-content-end">
                        <FontAwesomeIcon icon={faBolt} size="lg" className="custom-text-primary" />
                      </div>
                      <div className="numbers"><h3>{mantenimientosCount}</h3></div>
                      <div className="title"><h6>Mantenimientos ofrecidos</h6></div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row className="mt-2 d-flex flex-row">
              <Col lg="12" sm="12">
                <Card className="p-2 card-stats h-100">
                  <Card.Body className="text-center">
                    <div className="d-flex flex-row justify-content-center align-items-center gap-4">
                      <div className="icon-big">
                        <FontAwesomeIcon icon={faTruck} size="2x" className="custom-text-primary" />
                      </div>
                      <div className="d-flex flex-column align-items-center">
                        <div className="numbers"><h3>{deliveryServiceCount}</h3></div>
                        <div className="title"><h6>Solicitudes con servicio a domicilio</h6></div>
                      </div>
                      <div className="vr"></div>
                      <div className="d-flex flex-column align-items-center">
                        <div className="numbers">
                          <h3>
                            {solicitudes.length > 0 ? Math.round((deliveryServiceCount / solicitudes.length) * 100) : 0}
                            <FontAwesomeIcon className="ms-1" size="sm" icon={faPercent} />
                          </h3>
                        </div>
                        <div className="title"><h6>Del total de solicitudes</h6></div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
        </>
        )}
      </Container >
  );
}
