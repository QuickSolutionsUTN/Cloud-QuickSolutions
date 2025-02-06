import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useBackendURL } from '../contexts/BackendURLContext';
import AuthContext from '../contexts/AuthContext';
import AdminHeaderWithModal from '../components/admin/AdminHeaderWithModal';
import AdminTable from '../components/admin/AdminTable';
import RenderEditCategoryForm from '../components/admin/RenderEditCategoryForm';

function AdminCategoriesPage() {
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setnewCategory] = useState({
    descripcion: '',
    idCategoria: '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendURL = useBackendURL();
  const { userToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/categoria`);
        console.log("Categorías obtenidas:", response.data);
        setCategories(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
        setLoading(false);
      }
    };
    fetchCategories();
  }, [backendURL]);


  const handleAdd = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    setnewCategory({
      ...newCategory,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      console.log("guardando categoria... ", newCategory);
      const response = await axios.post(`${backendURL}/api/categoria`, newCategory, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      if (response.status === 201) {
        console.log("Categoria guardado correctamente");
        console.log("Respuesta del servidor", response.data);
        window.location.reload();
      } else {
        console.log("Error al guardar la categoria", response.data);
      }
    } catch (error) {
      console.error("Error al guardar la categoria", error);
    }

    setShowModal(false);
  };

  const columnsProducts = [
    { accessorKey: "id", header: "ID", enableSorting: true },
    { accessorKey: "descripcion", header: "Nombre" },
  ];

  const onEditSave = (editedCategory) => {
    return axios
      .put(`${backendURL}/api/categoria/${editedCategory.id}`, editedCategory, {
        headers: { Authorization: `Bearer ${userToken}` },
      })
      .then((res) => {
        console.log("Categoria actualizada correctamente");
        return res.data; // Se espera que devuelva el categoria actualizado
      });
  };

  // Callback para confirmar la eliminación del categoria
  const onDeleteConfirm = (id) => {
    return axios
      .delete(`${backendURL}/api/categoria/${id}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      })
      .then(() => {
        console.log("Categoria eliminada correctamente");
      });
  };

  return (
    <div className='admin-products d-flex flex-column h-100 w-100'>
      <AdminHeaderWithModal
        title="Administrar categorias"
        buttonText="Agregar Categoria"
        showModal={showModal}
        handleClose={handleClose}
        handleAdd={handleAdd}
        handleSave={handleSave}>
        <Form>
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="descripcion"
              value={newCategory.nombre}
              onChange={handleChange}
              placeholder="Nombre del categoria"
            />
          </Form.Group>
        </Form>
      </AdminHeaderWithModal>
      <div className='admin-products-content flex-fill w-100'>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <>
            <AdminTable
              initialData={categories}
              columns={columnsProducts}
              onEditSave={onEditSave}
              onDeleteConfirm={onDeleteConfirm}
              renderEditForm={(selectedItem, handleEditChange) => (
                <RenderEditCategoryForm
                  selectedItem={selectedItem}
                  handleEditChange={handleEditChange}
                />
              )}
              editModalTitle="Editar Categoria"
              deleteModalTitle="Confirmar Eliminación"
              deleteModalMessage="¿Estás seguro de que quieres eliminar esta categoria?" />
          </>
        )}
      </div>
    </div>
  );
}

export default AdminCategoriesPage;