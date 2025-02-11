import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useBackendURL } from '../contexts/BackendURLContext';
import AuthContext from '../contexts/AuthContext';
import AdminHeaderWithModal from '../components/admin/AdminHeaderWithModal';
import AdminTable from '../components/admin/AdminTable';
import RenderEditMaintenanceForm from '../components/admin/RenderEditMaintenanceForm';
import RenderAddMaintenanceForm from '../components/admin/RenderAddMaintenanceForm';
import RenderMaintenanceForm from '../components/admin/RenderMaintenanceForm';

function AdminMaintenancePage() {
  const [showModal, setShowModal] = useState(false);
  const [maintenance, setMaintenance] = useState({
    nombre: '',
    descripcion: '',
    idTipoProducto: '',
    checklist: [],
  });
  const [maintenanceArray, SetMaintenanceArray] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendURL = useBackendURL();
  const [selectedItem, setSelectedItem] = useState(null);
  const { userToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchMaintenanceArray = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/mantenimiento`);
        console.log("Mantenimientos obtenidos:", response.data);
        SetMaintenanceArray(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los mantenimientos:", error);
        setLoading(false);
      }
    };

    fetchMaintenanceArray();
  }, [backendURL]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/tipoproducto`);
        console.log("productos obtenidos:", response.data);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [backendURL]);

  const handleAdd = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    console.log("Cambiando mantenimiento...", e.target.name, e.target.value);
    const { name, value } = e.target;
    setMaintenance((prevMaintenance) => ({
      ...prevMaintenance,
      [name]: value,
    }));
  };

  const handleChecklistChange = (index, field, value) => {
    console.log("Cambiando tarea...", field, value);
    const updatedChecklist = [...maintenance.checklist];
    updatedChecklist[index][field] = value;
    setMaintenance({
      ...maintenance,
      checklist: updatedChecklist,
    });
    
    if (selectedItem) {
      setSelectedItem({
      ...selectedItem,
      checklist: updatedChecklist,
      });
    }
  };

  const addTask = () => {
    setMaintenance({
      ...maintenance,
      checklist: [...maintenance.checklist, { descripcion: '', obligatorio: false }],
    });
  };

  const handleSave = async () => {
    try {
      const maintenanceToSave = { ...maintenance };
      console.log("guardando mantenimiento... ", maintenanceToSave);
      let response;
      if (selectedItem) {
        /*
        response = await axios.put(`${backendURL}/api/mantenimiento/${selectedItem.id}`, maintenanceToSave, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });*/
      } else {
        /*
        response = await axios.post(`${backendURL}/api/mantenimiento`, maintenanceToSave, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });*/
      }
      if (response.status === 201 || response.status === 200) {
        console.log("Mantenimiento guardado correctamente");
        console.log("Respuesta del servidor", response.data);
        window.location.reload();
      } else {
        console.log("Error al guardar el mantenimiento", response.data);
      }
    } catch (error) {
      console.error("Error al guardar el mantenimiento", error);
    }

    setMaintenance({
      nombre: '',
      descripcion: '',
      idTipoProducto: '',
      checklist: [],
    });
    setSelectedItem(null);
    setShowModal(false);

  };

  const onDeleteConfirm = async (id) => {
    try {
      await axios.delete(`${backendURL}/api/mantenimiento/${id}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      console.log("Mantenimiento eliminado correctamente");
      SetMaintenanceArray((prevArray) => prevArray.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error al eliminar el mantenimiento", error);
    }
  };

  const columnsMaintenance = [
    { accessorKey: "id", header: "ID", enableSorting: true },
    {
      accessorKey: "idTipoProducto", header: "Producto",
      cell: ({ row, table }) => {
        const product = products.find((p) => p.id === row.original.idTipoProducto);
        return product ? product.descripcion : "Sin Producto";
      }
    },
    { accessorKey: "nombre", header: "Nombre" },
  ];

  return (
    <div className='admin-maintenace d-flex flex-column h-100 w-100'>
      <AdminHeaderWithModal
        title="Administrar mantenimientos"
        buttonText="Agregar Mantenimiento"
        showModal={showModal}
        handleClose={handleClose}
        handleAdd={handleAdd}
        handleSave={handleSave}>
        <RenderMaintenanceForm
          selectedItem={maintenance}
          products={products}
          handleChange={handleChange}
          handleChecklistChange={handleChecklistChange}
          addTask={addTask}
        />
      </AdminHeaderWithModal>
      <div className='admin-products-content flex-fill w-100'>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <>
            <AdminTable
              initialData={maintenanceArray}
              columns={columnsMaintenance}
              onEditSave={handleSave}
              onDeleteConfirm={onDeleteConfirm}
              renderEditForm={(selectedItem, handleChange) => (
                <RenderMaintenanceForm
                  selectedItem={selectedItem}
                  products={products}
                  handleChange={handleChange}
                  handleChecklistChange={handleChecklistChange}
                  addTask={addTask}
                />
              )}
              editModalTitle="Editar Mantenimiento"
              deleteModalTitle="Confirmar Eliminación"
              deleteModalMessage="¿Estás seguro de que quieres eliminar este mantenimiento?" />
          </>
        )}
      </div>
    </div>
  );
}

export default AdminMaintenancePage;