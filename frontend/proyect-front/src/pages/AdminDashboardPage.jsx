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
import { faTableCellsLarge, faScrewdriverWrench, faSquare, faX, faCheck, faDollarSign } from "@fortawesome/free-solid-svg-icons";
import apiService from "../services/axiosConfig";
import { useBackendURL } from '../contexts/BackendURLContext';
import AuthContext from '../contexts/AuthContext';
import axios from 'axios';

import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, ArcElement } from "chart.js";


export default function AdminDashboardPage() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [stateCount, setStateCount] = useState([0, 0, 0, 0, 0, 0]);
  const [serviceTypeCount, setServiceTypeCount] = useState([0, 0]);
  const [localRepairCount, setLocalRepairCount] = useState([0, 0]);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [categorias, setCategorias] = useState([]);
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
    const getCategorias = async () => {
      try {
        const response = await apiService.getCategories();
        console.log("Categorias obtenidas:", response.data);
        setCategorias(response.data);
        console.log("Categorias:", categorias);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener las categorias:", error);
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
    getCategorias();
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
    solicitudes.forEach((solicitud) => {
      switch (solicitud.tercearizado) {
        case false:
          localCount[0]++;
          break;
        case true:
          localCount[1]++;
          break;
        default:
          break;
      }
    });
    console.log("Local Count:", localCount);
    setLocalRepairCount(localCount);

    let earnings = 0;
    solicitudes.forEach((solicitud) => {
      if (solicitud.fechaFinalizada) earnings += solicitud.monto;
    }
    );
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

  const dataBar2 = {
    labels: ["Reparacion Local", "Subcontratadas"],
    datasets: [
      {
        data: [localRepairCount[0], localRepairCount[1]],
        backgroundColor: [
          "#FD7E14",
          "#007BFF",
        ],
        borderColor: [
          "rgba(199, 87, 0, 1)",
          "rgba(0, 86, 179, 1)",
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

  const optionsBar2 = {
    indexAxis: "y",
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
      <Container fluid>
        <Row className="m-2 d-flex flex-row">
          <Col lg="3" sm="6">
            <Card className="p-2 card-stats">
              <Card.Body className="text-center">
                <div className="d-flex justify-content-around flex-row ">
                  <div className="icon-big text-center icon-warning mb-3">
                    <FontAwesomeIcon icon={faFile} size="3x" className="custom-text-primary" />
                  </div>
                  <div className="numbers">
                    <Card.Title as="h5" className="text-dark font-weight-bold">
                      Solicitudes
                    </Card.Title>
                    <h5>{solicitudes.length}</h5>
                  </div>
                </div>
              </Card.Body>
              <Card.Footer>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="p-2 card-stats">
              <Card.Body className="text-center">
                <div className="d-flex justify-content-around flex-row ">
                  <div className="icon-big text-center icon-warning mb-3">
                    <FontAwesomeIcon icon={faDollarSign} size="3x" className="text-success" />
                  </div>
                  <div className="numbers">
                    <Card.Title as="h5" className="text-dark font-weight-bold">
                      Ganancias Mensuales
                    </Card.Title>
                    <h5>$ {monthlyEarnings}</h5>
                  </div>
                </div>
              </Card.Body>
              <Card.Footer>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="p-2 card-stats">
              <Card.Body className="text-center">
                <div className="d-flex justify-content-around flex-row ">
                  <div className="icon-big text-center icon-warning mb-3">
                    <FontAwesomeIcon icon={faScrewdriverWrench} size="3x" className="custom-text-primary" />
                  </div>
                  <div className="numbers">
                    <Card.Title as="h5" className="text-dark font-weight-bold">
                      Productos
                    </Card.Title>
                    <h6>{productos.length}</h6>
                  </div>
                </div>
              </Card.Body>
              <Card.Footer>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="p-2 card-stats">
              <Card.Body className="text-center">
                <div className="d-flex justify-content-around flex-row ">
                  <div className="icon-big text-center icon-warning mb-3">
                    <FontAwesomeIcon icon={faUser} size="3x" className="custom-text-primary" />
                  </div>
                  <div className="numbers">
                    <Card.Title as="h5" className="text-dark font-weight-bold">
                      Usuarios
                    </Card.Title>
                    <h5>{usuarios.length}</h5>
                  </div>
                </div>
              </Card.Body>
              <Card.Footer>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
        <Row className="m-2 d-flex flex-row">
          <Col md="6" >
            <Card className="m-2 card-stats">
              <Card.Body className="text-center">
                <div className="d-flex justify-content-around flex-column ">
                  <Card.Title as="h5" className="d-flex flex-row text-dark justify-content-around align-items-center">
                    <span style={{ color: "green" }}>
                      <FontAwesomeIcon icon={faCheck} className="me-2" />
                      Cantidad de presupuestos aprobados
                    </span>
                    <span>{solicitudes.length}</span>
                  </Card.Title>
                  <Card.Title as="h5" className="d-flex flex-row text-dark justify-content-around align-items-center">
                    <span style={{ color: "red" }}>
                      <FontAwesomeIcon icon={faX} className="me-2" />
                      Cantidad de presupuestos rechazados
                    </span>
                    <span>{solicitudes.length}</span>
                  </Card.Title>
                </div>
              </Card.Body>
              <Card.Footer>
              </Card.Footer>
            </Card>
            <Card className="m-2">
              <Card.Header>
                <Card.Title as="h5" className="text-center">Estado solicitudes</Card.Title>
              </Card.Header>
              <Card.Body>
                <Bar data={dataBar1} options={optionsBar1} />
              </Card.Body>
            </Card>
          </Col>
          <Col md="6">
            <Row>
              <Col md="6" className="d-flex flex-column">
                <Card className="m-2">
                  <Card.Header className="d-flex justify-content-center">
                    <Card.Title as="h5">Tipo de solicitud</Card.Title>
                  </Card.Header>
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex flex-column">
                      <div className="d-flex mb-2 justify-content-between">
                        <span className="p-1 d-flex flex-row">
                          <FontAwesomeIcon className="me-2 pt-1" size="lg" style={{ color: "#FF6F61" }} icon={faSquare} />
                          <h5>Reparaciones</h5></span>
                        <span><h5>{serviceTypeCount[0]}</h5></span>
                      </div>
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <span className="p-1 d-flex flex-row">
                          <FontAwesomeIcon className="me-2 pt-1" size="lg" style={{ color: "#A7C7E7" }} icon={faSquare} />
                          <h5>Mantenimientos</h5></span >
                        <span ><h5>{serviceTypeCount[1]}</h5></span>
                      </div>
                    </div>
                    <Pie className="p-4" data={dataPie} options={optionsPie} />
                  </Card.Body>
                </Card>
              </Col>
              <Col md="6">
                <Card className="m-2">
                  <Card.Header>
                    <Card.Title as="h5" className="text-center">Reparacion local vs externa</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Bar data={dataBar2} options={optionsBar2} />
                  </Card.Body>
                </Card>
                <Card className="m-2">
                  <Card.Header>
                    <Card.Title as="h5" className="text-center">Con servicio de envios</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Bar data={dataBar2} options={optionsBar2} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg="6" sm="6">
                <Card className="p-2 m-2 card-stats">
                  <Card.Body className="text-center">
                    <div className="d-flex justify-content-around flex-row ">
                      <div className="icon-big text-center icon-warning mb-3">
                        <FontAwesomeIcon icon={faTableCellsLarge} size="3x" className="custom-text-primary" />
                      </div>
                      <div className="numbers">
                        <Card.Title as="h5" className="text-dark font-weight-bold">
                          Categorias
                        </Card.Title>
                        <h6>{categorias.length}</h6>
                      </div>
                    </div>
                  </Card.Body>
                  <Card.Footer>
                  </Card.Footer>
                </Card>
              </Col>
              <Col lg="6" sm="6">
                <Card className="p-2 m-2 card-stats">
                  <Card.Body className="text-center">
                    <div className="d-flex justify-content-around flex-row ">
                      <div className="icon-big text-center icon-warning mb-3">
                        <FontAwesomeIcon icon={faTableCellsLarge} size="3x" className="custom-text-primary" />
                      </div>
                      <div className="numbers">
                        <Card.Title as="h5" className="text-dark font-weight-bold">
                          Cantidad x
                        </Card.Title>
                        <h6>{categorias.length}</h6>
                      </div>
                    </div>
                  </Card.Body>
                  <Card.Footer>
                  </Card.Footer>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container >
    </>
  );
}
