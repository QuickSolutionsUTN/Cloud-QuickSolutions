import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useBackendURL } from "../../contexts/BackendURLContext.jsx";
import DataTable from "react-data-table-component";
import axios from "axios";
import "./userRequestsList.css";
import {Button, Modal, Spinner} from "react-bootstrap";
import AuthContext from "../../contexts/AuthContext.jsx";

function UserRequestsList({ userEmail }) {
  const [userRequests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const { userToken } = useContext(AuthContext);
  const backendURL = useBackendURL();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching user requests...", backendURL, " from user ", {
          userEmail,
        });
        const response = await axios.get(
          `${backendURL}/api/users/solicitudes`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        console.log("User requests:", response.data);
        const mappedData = response.data.map((request) => ({
          id: request.id,
          idSolicitud: request.id,
          tipoServicio: request.tipoServicio,
          tipoDeProducto: request.tipoDeProducto,
          fechaGeneracion: new Date(request.fechaGeneracion).toLocaleDateString(
            "es-ES",
            { day: "2-digit", month: "2-digit", year: "numeric" }
          ),
          estado: request.estado,
        }));
        mappedData.sort((a, b) => b.idSolicitud - a.idSolicitud);
        setRequests(mappedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user requests:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCancel = async () => {
    try {
      await axios.put(`${backendURL}/api/Solicitud/${selectedRequestId}/estado-usuario`, {
        id: selectedRequestId,
        idSolicitudServicioEstado: 6
      }, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      setRequests(prevRequests => prevRequests.map(request => 
        request.idSolicitud === selectedRequestId ? { ...request, estado: 'Cancelada' } : request
      ));
      setShowModal(false);
    } catch (error) {
      console.error('Error al cancelar la solicitud:', error);
    }
  };

  const getButtonClass = (estado) => {
    switch (estado) {
      case 'Cancelada':
        return 'detail-button cancelada';
      case 'Presupuestada':
        return 'detail-button presupuestada';
      case 'Aprobada':
        return 'detail-button aprobada';
      case 'Finalizada':
        return 'detail-button finalizada';
      default:
        return 'detail-button';
    }
  };

  const columns = [
    {
      name: "Id",
      selector: (row) => row.idSolicitud,
      sortable: true,
      width: "8%",
    },
    {
      name: "Fecha",
      selector: (row) => row.fechaGeneracion,
      sortable: true,
      width: "8%",
    },
    {
      name: "Servicio",
      selector: (row) => row.tipoServicio,
      sortable: true,
      width: "10%",
    },
    {
      name: "Producto",
      selector: (row) => row.tipoDeProducto,
      sortable: true,
    },
    {
      name: "Estado",
      selector: (row) => row.estado,
      sortable: true,
    },
    {
      name: "Detalle",
      cell: (row) => (
        <>
          <Button
            variant="outline-secondary"
            className={getButtonClass(row.estado)}
            onClick={() => navigate(`./${row.idSolicitud}`)}
          >
            Detalle
          </Button>
          {row.estado === 'Iniciada' && (
            <Button
              variant="danger"
              className="cancel-button"
              onClick={() => {
                setSelectedRequestId(row.idSolicitud);
                setShowModal(true);
              }}
            >
              Cancelar
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <>
    {loading ? (
              <Spinner animation="border" />
            ) : (
              <>
      <DataTable columns={columns} data={userRequests} />
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Cancelación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas cancelar la solicitud?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Atrás
          </Button>
          <Button variant="danger" onClick={handleCancel}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
      </>
    )}
    </>
  );
}

export default UserRequestsList;
