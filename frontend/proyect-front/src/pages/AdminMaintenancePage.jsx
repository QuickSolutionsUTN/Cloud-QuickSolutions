import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
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
    checklist: [],
  });
  const [maintenanceArray, setMaintenanceArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [createErrors, setCreateErrors] = useState({});

  useEffect(() => {
    loadMaintenances();
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

  const handleAdd = () => {
    setMaintenance({
      nombre: '',
      descripcion: '',
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

  const validateMaintenance = (obj) => {
    const errors = {};
    if (!obj.nombre || String(obj.nombre).trim() === '') {
      errors.nombre = 'Nombre es obligatorio';
    }
    if (!obj.descripcion || String(obj.descripcion).trim() === '') {
      errors.descripcion = 'Descripción es obligatoria';
    }
    const checklistErrors = [];
    (obj.checklist || []).forEach((task, idx) => {
      const taskErrors = {};
      if (!task || !task.tarea || String(task.tarea).trim() === '') {
        taskErrors.tarea = 'Descripción de la tarea es obligatoria';
      }
      checklistErrors[idx] = taskErrors;
    });
    if (checklistErrors.some(e => e && Object.keys(e).length > 0)) {
      errors.checklist = checklistErrors;
    }
    return errors;
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
    console.log("guardando mantenimiento... ", maintenanceToSave);
    const errors = validateMaintenance(maintenanceToSave);
    if (errors && Object.keys(errors).length > 0) {
      setCreateErrors(errors);
      return;
    }
    setCreateErrors({});
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
          handleChange={handleChange}
          errors={createErrors}
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
            validateEdit={validateMaintenance}
            onDeleteConfirm={onDeleteConfirm}
            renderEditForm={(selectedItem, handleEditChange, editErrors) => (
              <RenderEditMaintenanceForm
                maintenance={selectedItem}
                handleEditChange={handleEditChange}
                errors={editErrors}
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