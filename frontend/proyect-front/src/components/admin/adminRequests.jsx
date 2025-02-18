import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import AuthContext from '../../contexts/AuthContext.jsx';
import apiService from '../../services/axiosConfig.jsx';
import './adminRequests.css'

function AdminRequests() {
  const [userRequests, setUserRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Buscando solicitudes con backendURL: ");
        const response = await apiService.getRequestsAdmin();
        console.log("Respuesta... ", response);
        const mappedData = response.data.map(request => ({
          id: request.id,
          idSolicitud: request.id,
          tipoServicio: request.tipoServicio,
          tipoDeProducto: request.tipoDeProducto,
          fechaGeneracion: new Date(request.fechaGeneracion).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
          estado: request.estado,
          cliente: request.emailSolicitante

          //cliente: `${request.user.apellido} ${request.user.nombre}`
        }));
        mappedData.sort((a, b) => b.idSolicitud - a.idSolicitud);
        setUserRequests(mappedData);
      } catch (error) {
        console.error("Error: ", error);
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      name: 'Servicio',
      selector: row => row.tipoServicio,
      sortable: true,
      width: '10%',
    },
    {
      name: 'Id',
      selector: row => row.idSolicitud,
      sortable: true,
      width: '8%',
    },
    {
      name: 'Cliente',
      selector: row => row.cliente,
      sortable: true,
    },
    {
      name: 'Fecha',
      selector: row => row.fechaGeneracion,
      sortable: true,
      width: '8%',
    },
    {
      name: 'Producto',
      selector: row => row.tipoDeProducto,
      sortable: true,
    },
    {
      name: 'Estado',
      selector: row => row.estado,
      sortable: true,
    },
    {
      name: 'Gestión',
      cell: row => (
        <Button variant="outline-success" onClick={() => navigate(`./${row.idSolicitud}`)}>
          Gestionar
        </Button>
      ),
    }
  ];

  return (
    <div className='Admin-Requests'>
      <h2>Listado de solicitudes</h2>
      <DataTable 
        columns={columns}
        data={userRequests}
      />
    </div>
  );
}

export default AdminRequests;