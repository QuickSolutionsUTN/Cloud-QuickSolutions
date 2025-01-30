import React, {useState, useEffect, useContext} from "react";
import { useNavigate } from 'react-router-dom';
import {useBackendURL} from '../../contexts/BackendURLContext.jsx';
import DataTable from 'react-data-table-component';
import axios from "axios";
import './userRequestsList.css';
import Button from 'react-bootstrap/Button';
import AuthContext from '../../contexts/AuthContext.jsx';

function UserRequestsList({userEmail}) {
  const [userRequests, setRequests]=useState([]);
  const { userToken } = useContext(AuthContext);
  const backendURL = useBackendURL();
  const navigate = useNavigate();

  useEffect(()=>{
    const fetchData=async ()=>{
      try{
        console.log('Fetching user requests...', backendURL,' from user ' , {userEmail});
        const response= await axios.get(`${backendURL}/api/users/solicitudes`,{
          headers: {
              Authorization: `Bearer ${userToken}`,
          },
      });
        console.log('User requests:', response.data);
        const mappedData = response.data.map(request => ({
          id: request.id,
          idSolicitud: request.id,
          tipoServicio: request.tipoServicio,
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
      width: '8%',
    },
    {
      name:'Fecha',
      selector:row=> row.fechaGeneracion,
      sorteable:true,
      width: '8%',
    },
    {
      name:'Servicio',
      selector:row=> row.tipoServicio,
      sorteable:true,
      width: '10%',
    },
    {
      name:'Producto',
      selector:row=> row.tipoDeProducto,
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
        <Button variant="outline-secondary" onClick={() => navigate(`./${row.idSolicitud}`)}>
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

