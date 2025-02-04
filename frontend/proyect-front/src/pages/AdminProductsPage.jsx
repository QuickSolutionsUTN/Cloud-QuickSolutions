import React from 'react';
import AdminProductsTable from '../components/admin/AdminProductsTable';
import { useState, useEffect, useContext } from 'react';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useBackendURL } from '../contexts/BackendURLContext';
import AuthContext from '../contexts/AuthContext';
import './AdminProductsPage.css';

function AdminProductsPage() {
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    descripcion: '',
    idCategoria: '',
  });
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendURL = useBackendURL();
  const { userToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/categoria`);
        console.log("Categorías obtenidas:", response.data);
        setCategories(response.data);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };

    fetchCategories();
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

  const handleAgregar = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProduct = async () => {
    try {
      console.log("guardando producto... ", newProduct);
      const response = await axios.post(`${backendURL}/api/tipoproducto`, newProduct, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      if (response.status === 201) {
        console.log("Producto guardado correctamente");
        console.log("Respuesta del servidor", response.data);
        window.location.reload();
      } else {
        console.log("Error al guardar el producto", response.data);
      }
    } catch (error) {
      console.error("Error al guardar el producto", error);
    }

    setShowModal(false);
  };

  return (
    <div className='admin-products w-100'>
      <div className='admin-products-header p-2'>
        <h2>Administrar productos</h2>
        <button className="btn btn-primary" onClick={handleAgregar}>
          Agregar Producto
        </button>
      </div>
      <div className='admin-products-content p-2'>
        <div className='admin-products-table'>
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <AdminProductsTable initialProducts={products} categories={categories} />
          )}
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="descripcion"
                value={newProduct.nombre}
                onChange={handleChange}
                placeholder="Nombre del producto"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                as="select"
                name="idCategoria"
                value={newProduct.categoria}
                onChange={handleChange}
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((category, index) => (
                  <option key={index} value={category.id}>
                    {category.descripcion}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveProduct}>
            Guardar Producto
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminProductsPage;