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
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendURL = useBackendURL();
  const { userToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/users`, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        console.log("Usuarios obtenidos:", response.data);
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/rol`, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        console.log("Roles obtenidos:", response.data);
        setRoles(response.data);
      } catch (error) {
        console.error("Error al obtener los roles:", error);
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    setnewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  const columnsUsers = [
    { accessorKey: "id", header: "ID", enableSorting: true },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "apellido", header: "Apellido" },
    { accessorKey: "rol", header: "Rol" },
  ];

  const onEditSave = (editedUser) => {
    return axios
      .put(`${backendURL}/api/users/${editedUser.id}/role`, {
        rol:editedUser.rol}, {
        headers: { Authorization: `Bearer ${userToken}` },
      })
      .then((res) => {
        console.log("Usuario actualizado correctamente");
        return res.data;
      });
  };

  // Callback para confirmar la eliminación del categoria
  const onDeleteConfirm = (id) => {
    return axios
      .delete(`${backendURL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      })
      .then(() => {
        console.log("USuario eliminado correctamente");
        setUsers(users.filter((user) => user.id !== id));
      });
  };

  return (
    <div className='admin-products d-flex flex-column h-100 w-100'>
      <div className='admin-header-component'>
        <h2>Administrar Usuarios</h2>
      </div >
      <div className='admin-users-content flex-fill w-100'>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <>
            <AdminTable
              initialData={users}
              columns={columnsUsers}
              onEditSave={onEditSave}
              onDeleteConfirm={onDeleteConfirm}
              renderEditForm={(selectedItem, handleEditChange) => (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="id"
                      value={selectedItem.id || ""}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="text"
                      name="email"
                      value={selectedItem.email || ""}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Rol</Form.Label>
                    <Form.Control
                      as="select"
                      name="rol"
                      value={selectedItem.rol || ""}
                      onChange={handleEditChange}
                    >
                      {roles.map((role) => (
                        <option key={role.id} value={role.descripcion}>
                          {role.descripcion}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Form>
              )}
              editModalTitle="Editar Usuario"
              deleteModalTitle="Confirmar Eliminación"
              deleteModalMessage="¿Estás seguro de que quieres eliminar este usuario?" />
          </>
        )}
      </div>
    </div>
  );
}

export default AdminCategoriesPage;