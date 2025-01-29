import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import {useBackendURL} from '../../contexts/BackendURLContext.jsx';
import DataTable from 'react-data-table-component';
import axios
from "axios";
import { Button } from "react-bootstrap";
import './userRequestsList.css'

function UserRequestsList({userEmail}) {
  const [userRequests, setRequests]=useState([]);
  const backendURL = useBackendURL();
  const navigate = useNavigate();

  useEffect(()=>{
    const fetchData=async ()=>{
      try{
        console.log('Fetching user requests...', backendURL,' from user ' , {userEmail});
        const response= await axios.get(`${backendURL}/api/users/${userEmail}/solicitudes`);
        console.log('User requests:', response.data);
        const mappedData = response.data.map(request => ({
          id: request.id,
          idSolicitud: request.id,
          tipoServicio: request.tipoServicio,
          categoria: request.categoria,
          tipoDeProducto: request.tipoDeProducto,
          fechaGeneracion: new Date(request.fechaGeneracion).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
          estado: request.estado
        }));
        setRequests(mappedData);
      } catch (error) {
        console.error('Error fetching user requests:', error);
    };
  };
  fetchData();
},[]);
  const columns=[
    {
      name:'Id',
      selector:row=> row.idSolicitud,
      sorteable:true,
      width: '200px',
    },
    {
      name:'Servicio',
      selector:row=> row.tipoServicio,
      sorteable:true,
    },
    {
      name:'Categoria',
      selector:row=> row.categoria,
      sorteable:true,
    },
    {
      name:'Producto',
      selector:row=> row.tipoDeProducto,
      sorteable:true,
    },
    {
      name:'Fecha',
      selector:row=> row.fechaGeneracion,
      sorteable:true,
    },
    {
      name:'Estado',
      selector:row=> row.estado,
      sorteable:true,
    },
    {
      name: 'Detalle',
      cell: row => (
        <Button className="detail-button" onClick={() => navigate(`./${row.idSolicitud}`)}>
          Detalle
        </Button>
      ),
    }
  ];

  return(
    <DataTable
      columns={columns}
      data={userRequests}
    />
  );
  
 }

 export default UserRequestsList;

 