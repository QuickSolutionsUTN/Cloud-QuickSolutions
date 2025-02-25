import React, { useEffect, useState, useContext } from "react";
// react-bootstrap components
import {
  Button,
  Card,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faUser } from "@fortawesome/free-regular-svg-icons";
import { faBolt, faScrewdriverWrench, faSquare, faX, faCheck, faDollarSign, faHourglass, faTruck, faPercent, faHelmetSafety, faBold } from "@fortawesome/free-solid-svg-icons";
import apiService from "../services/axiosConfig";
import { useBackendURL } from '../contexts/BackendURLContext';
import AuthContext from '../contexts/AuthContext';
import axios from 'axios';
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, ArcElement } from "chart.js";
import "./adminDashboardPage.css";
import { set } from "react-hook-form";


export default function AdminDashboardPage() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [stateCount, setStateCount] = useState([0, 0, 0, 0, 0, 0]);
  const [serviceTypeCount, setServiceTypeCount] = useState([0, 0]);
  const [localRepairCount, setLocalRepairCount] = useState([0, 0]);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [aprobedBudgetsCount, setAprobedBudgetsCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [rejectedBudgetsCount, setRejectedBudgetsCount] = useState(0);
  const [deliveryServiceCount, setDeliveryServiceCount] = useState(0);
  const [successfullMaintenances, setSuccessfullMaintenances] = useState(0);
  const [successfullRepairs, setSuccessfullRepairs] = useState(0);
  const[maintenanceArray, setMaintenanceArray] = useState([]);
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const backendURL = useBackendURL();
  const { userToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSolicitudes = async () => {
      try {
        const response = await apiService.getRequestsAdmin();
        console.log("Solicitudes obtenidas:", response.data);
        setSolicitudes(response.data);
        console.log("Solicitudes:", solicitudes);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener las solicitudes:", error);
        setLoading(false);
      }
    };
    const getMaintenanceArray = async () => {
      try {
        const response = await apiService.getMaintenanceArray();
        console.log("Productos obtenidos:", response.data);
        setMaintenanceArray(response.data);
        console.log("Productos:", productos);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
        setLoading(false);
      }
    }
    const getProductos = async () => {
      try {
        const response = await apiService.getProducts();
        console.log("Productos obtenidos:", response.data);
        setProductos(response.data);
        console.log("Productos:", productos);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
        setLoading(false);
      }
    }
    const getUsuarios = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/users`, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        console.log("Usuarios obtenidos:", response.data);
        setUsuarios(response.data);
        console.log("Usuarios:", usuarios);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        setLoading(false);
      }
    };
    getSolicitudes();
    getMaintenanceArray();
    getProductos();
    getUsuarios();
  }, []);

  useEffect(() => {
    let count = [0, 0, 0, 0, 0, 0];
    solicitudes.forEach((solicitud) => {
      switch (solicitud.estado) {
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

    let typeCount = [0, 0];
    solicitudes.forEach((solicitud) => {
      switch (solicitud.tipoServicio) {
        case "Reparacion":
          typeCount[0]++;
          break;
        case "mantenimiento":
          typeCount[1]++;
          break;
        default:
          break;
      }
    });
    setServiceTypeCount(typeCount);

    let localCount = [0, 0];
    let aprobedBudget = 0;
    let pendingCount = 0;
    let rejectedCount = 0;
    let deliverySCount = 0;
    let successfullM = 0;
    let successfullR = 0;
    let earnings = 0;
    solicitudes.forEach((solicitud) => {
      if (!solicitud.tercearizado) localCount[0]++;
      else localCount[1]++;
      if (solicitud.fechaAprobada) aprobedBudget++;
      if (!solicitud.fechaFinalizada && solicitud.fechaAprobada) pendingCount++;
      if (solicitud.fechaPresupuestada && solicitud.estado == "Cancelada") rejectedCount++;
      if (solicitud.conLogistica) deliverySCount++;
      if (solicitud.fechaFinalizada && solicitud.tipoServicio == "mantenimiento") successfullM++;
      if (solicitud.fechaFinalizada && solicitud.tipoServicio == "Reparacion") successfullR++;
      if (solicitud.fechaFinalizada) earnings += solicitud.monto;
    });
    setLocalRepairCount(localCount);
    setAprobedBudgetsCount(aprobedBudget);
    setPendingCount(pendingCount);
    setRejectedBudgetsCount(rejectedCount);
    setDeliveryServiceCount(deliverySCount);
    setSuccessfullMaintenances((successfullM * 100) / serviceTypeCount[1]);
    setSuccessfullRepairs((successfullR * 100) / serviceTypeCount[0]);
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
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",  // Posición de la leyenda
      },
      tooltip: {
        enabled: true,  // Habilitar tooltips
      },
    },
  };

  return (
    <>
      <Container fluid className="admin-dashboard">
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
                  <div className="numbers"><h3>{usuarios.length}</h3></div>
                  <div class="title"><h6>Usuarios</h6></div>
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
                  <Card.Body className="d-flex flex-row justify-content-center align-items-center">
                    <div className="d-flex flex-column ms-3 align-items-center">
                      <div className="d-flex mb-2 justify-content-between flex-column align-items-center">
                        <span className="p-1 d-flex flex-row">
                          <FontAwesomeIcon className="me-1 pt-1" size="lg" style={{ color: "#FF6F61" }} icon={faSquare} />
                          <h5>Reparaciones </h5></span>
                        <span><h5>{serviceTypeCount[0]}</h5></span>
                      </div>
                      <div className="d-flex flex-row justify-content-between flex-column align-items-center">
                        <span className="p-1 d-flex flex-row">
                          <FontAwesomeIcon className="me-1 pt-1" size="lg" style={{ color: "#A7C7E7" }} icon={faSquare} />
                          <h5>Mantenimientos </h5></span >
                        <span ><h5>{serviceTypeCount[1]}</h5></span>
                      </div>
                    </div>
                    <div className="d-flex flex-column align-items-center">
                      <div className="w-80 h-auto mx-auto">
                        <Pie data={dataPie} options={optionsPie} />
                      </div>
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
                      <div className="numbers"><h3>{productos.length}</h3></div>
                      <div className="title"><h6>Productos en el catalogo</h6></div>
                      <hr />
                      <div className="icon-big d-flex justify-content-end">
                        <FontAwesomeIcon icon={faBolt} size="lg" className="custom-text-primary" />
                      </div>
                      <div className="numbers"><h3>{maintenanceArray.length}</h3></div>
                      <div className="title"><h6>Mantenimientos ofrecidos</h6></div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row className="mt-2 d-flex flex-row">
              <Col lg="6" sm="6">
                <Card className="p-2 card-stats h-100">
                  <Card.Body className="text-center">
                    <div className="d-flex flex-row justify-content-center">

                      <div className="icon-big d-flex justify-content-end">
                        <FontAwesomeIcon icon={faTruck} size="lg" className="custom-text-primary" />
                      </div>
                      <div className="d-flex flex-column">
                        <div className="numbers"><h3>{deliveryServiceCount}</h3></div>
                        <div className="title"><h6>Solicitudes con servicio de logistica</h6></div>
                      </div>
                      <div className="d-flex flex-column">
                        <div className="numbers"><h3>
                          {Math.round((deliveryServiceCount / solicitudes.length) * 100)}
                          <FontAwesomeIcon className="ms-2" size="sm" icon={faPercent} /></h3></div>
                        <div className="title"><h6>Del total de solicitudes</h6></div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg="6" sm="6">
                <Card className="p-2 card-stats h-100">
                  <Card.Body className="text-center">
                    <div className="d-flex flex-row justify-content-center">

                      <div className="icon-big d-flex justify-content-end">
                        <FontAwesomeIcon icon={faHelmetSafety} size="lg" className="custom-text-primary" />
                      </div>
                      <div className="d-flex flex-column">
                        <div className="numbers"><h3>{(localRepairCount[1])}</h3></div>
                        <div className="title"><h6>Solicitudes con personal subcontrado</h6></div>
                      </div>
                      <div className="d-flex flex-column">
                        <div className="numbers"><h3>
                          {Math.round((localRepairCount[1] / solicitudes.length) * 100)}
                          <FontAwesomeIcon className="ms-2" size="sm" icon={faPercent} /></h3></div>
                        <div className="title"><h6>Del total de solicitudes</h6></div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container >
    </>
  );
}
