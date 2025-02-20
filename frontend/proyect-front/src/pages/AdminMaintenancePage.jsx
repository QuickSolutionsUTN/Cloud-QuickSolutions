import React, { useState, useEffect, useContext } from 'react';
import { Spinner } from 'react-bootstrap';
import { useBackendURL } from '../contexts/BackendURLContext';
import AuthContext from '../contexts/AuthContext';
import AdminHeaderWithModal from '../components/admin/AdminHeaderWithModal';
import AdminTable from '../components/admin/AdminTable';
import RenderMaintenanceForm from '../components/admin/RenderMaintenanceForm';
import RenderEditMaintenanceForm from '../components/admin/RenderEditMaintenanceForm';
import apiService from '../services/axiosConfig';

function AdminMaintenancePage() {
  const [showModal, setShowModal] = useState(false);
  const [maintenance, setMaintenance] = useState({
    nombre: '',
    descripcion: '',
    idTipoProducto: 0,
    checklist: [],
  });
  const [maintenanceArray, setMaintenanceArray] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendURL = useBackendURL();
  const [selectedItem, setSelectedItem] = useState(null);
  const { userToken } = useContext(AuthContext);

  useEffect(() => {
    loadMaintenances();
    loadProducts();
  }, []);

  const loadMaintenances = async () => {
    try {
      const response = await apiService.getMaintenanceArray();
      console.log("Mantenimientos obtenidos:", response.data);
      setMaintenanceArray(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los mantenimientos:", error);
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await apiService.getProducts();
      console.log("productos obtenidos:", response.data);
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setMaintenance({
      nombre: '',
      descripcion: '',
      idTipoProducto: 0,
      checklist: [],
    });
    setSelectedItem(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaintenance((prevMaintenance) => ({
      ...prevMaintenance,
      [name]: value,
    }));
  };

  const handleEditSave = async (updatedItem) => {
    console.log("Guardando cambios en el mantenimiento...", updatedItem);
    try {
      const response = await apiService.updateMaintenance(updatedItem);
      console.log("Mantenimiento actualizado correctamente:", response.data);
      setMaintenanceArray((prevArray) =>
        prevArray.map((item) => (item.id === updatedItem.id ? response.data : item))
      );
      return response.data;
    } catch (error) {
      console.error("Error al actualizar el mantenimiento:", error);
    }
  };

  const handleSave = async () => {
    const maintenanceToSave = { ...maintenance };
    maintenanceToSave.idTipoProducto = parseInt(maintenance.idTipoProducto);
    console.log("guardando mantenimiento... ", maintenanceToSave);
    try {
      const response = await apiService.createMaintenance(maintenanceToSave);
      console.log("Mantenimiento guardado correctamente:", response.data);
      setMaintenanceArray((prevArray) => [...prevArray, response.data]);
      setShowModal(false);
    } catch (error) {
      console.error("Error al guardar el mantenimiento:", error);
    }
  };

  const onDeleteConfirm = async (id) => {
    try {
      const response = await apiService.deleteMaintenance(id);
      console.log("Mantenimiento eliminado correctamente");
      setMaintenanceArray((prevArray) => prevArray.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error al eliminar el mantenimiento", error);
    }
  };

  const columnsMaintenance = [
    { accessorKey: "id", header: "ID", enableSorting: true },
    {
      accessorKey: "idTipoProducto", header: "Producto",
      cell: ({ row }) => {
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
          maintenance={maintenance}
          products={products}
          handleChange={handleChange}
        />
      </AdminHeaderWithModal>
      <div className='admin-products-content flex-fill w-100'>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <AdminTable
            initialData={maintenanceArray}
            columns={columnsMaintenance}
            onEditSave={handleEditSave}
            onDeleteConfirm={onDeleteConfirm}
            renderEditForm={(selectedItem, handleEditChange) => (
              <RenderEditMaintenanceForm
                maintenance={selectedItem}
                handleEditChange={handleEditChange}
                products={products}
              />
            )}
            editModalTitle="Editar Mantenimiento"
            deleteModalTitle="Confirmar Eliminación"
            deleteModalMessage="¿Estás seguro de que quieres eliminar este mantenimiento?"
          />
        )}
      </div>
    </div>
  );
}

export default AdminMaintenancePage;