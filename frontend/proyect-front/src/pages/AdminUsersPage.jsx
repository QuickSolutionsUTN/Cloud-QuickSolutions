import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useBackendURL } from '../contexts/BackendURLContext';
import AuthContext from '../contexts/AuthContext';
import AdminHeaderWithModal from '../components/admin/AdminHeaderWithModal';
import AdminTable from '../components/admin/AdminTable';

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const roles = ['admin', 'empleado', 'cliente']; 
  const [loading, setLoading] = useState(true);
  const backendURL = useBackendURL();
  const { userToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/perfiles/`, {
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
  }, [backendURL, userToken]);

  const columnsUsers = [
    { accessorKey: "id", header: "ID", enableSorting: true },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "apellido", header: "Apellido" },
    { accessorKey: "rol", header: "Rol" },
  ];

  const onEditSave = (editedUser) => {
    return axios
      .put(`${backendURL}/api/perfiles/${editedUser.id}/`, editedUser, {
        headers: { Authorization: `Bearer ${userToken}` },
      })
      .then((res) => {
        console.log("Usuario actualizado correctamente");
        return res.data;
      });
  };

  const onDeleteConfirm = (id) => {
    return axios
      .delete(`${backendURL}/api/perfiles/${id}/`, {
        headers: { Authorization: `Bearer ${userToken}` },
      })
      .then(() => {
        console.log("Usuario eliminado correctamente");
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
                      type="email"
                      name="email"
                      value={selectedItem.email || (selectedItem.id && selectedItem.id.email) || ""}
                      readOnly
                      disabled
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      name="nombre"
                      value={selectedItem.nombre || ""}
                      onChange={handleEditChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control
                      type="text"
                      name="apellido"
                      value={selectedItem.apellido || ""}
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Rol</Form.Label>
                    <Form.Control
                      as="select"
                      name="rol"
                      value={selectedItem.rol || "cliente"}
                      onChange={handleEditChange}
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
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

export default AdminUsersPage;