import { useState, useEffect, useContext } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import apiService from '../services/axiosConfig';
import AuthContext from '../contexts/AuthContext';
import AdminHeaderWithModal from '../components/admin/AdminHeaderWithModal';
import AdminTable from '../components/admin/AdminTable';
import RenderEditProductForm from '../components/admin/RenderEditProductForm';

function AdminProductsPage() {
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    descripcion: '',
    id_categoria: '', 
  });
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.getCategories();
        console.log("Categorías obtenidas:", response.data);
        setCategories(response.data);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
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

    fetchProducts();
  }, []);

  const handleAdd = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      console.log("guardando producto... ", newProduct);
      const response = await apiService.createProduct(newProduct);
      if (response.status === 201) {
        console.log("Producto guardado correctamente");
        console.log("Respuesta del servidor", response.data);
        // Append the created product to the table data instead of reloading
        setProducts((prev) => [...prev, response.data]);
        // Reset form
        setNewProduct({ descripcion: '', id_categoria: '' });
      } else {
        console.log("Error al guardar el producto", response.data);
      }
    } catch (error) {
      console.error("Error al guardar el producto", error);
    }

    setShowModal(false);
  };

  const columnsProducts = [
    { accessorKey: "id", header: "ID", enableSorting: true },
    { accessorKey: "descripcion", header: "Nombre" },
    {
      accessorKey: "id_categoria",
      header: "Categoría",
      cell: ({ row }) => {
        const prodCatId = row.original.id_categoria ?? row.original.idCategoria ?? row.original.idCategoria;
        const category = categories.find((cat) => String(cat.id) === String(prodCatId));
        return category ? category.descripcion : "Sin categoría";
      },
    },
  ];

  const onEditSave = (editedProduct) => {
    return apiService.updateProduct(editedProduct, {
        headers: { Authorization: `Bearer ${userToken}` },
      })
      .then((res) => {
        console.log("Producto actualizado correctamente");
        return res.data; 
      });
  };

  const onDeleteConfirm = (id) => {
    return apiService.deleteProduct(id, {
        headers: { Authorization: `Bearer ${userToken}` },
      })
      .then(() => {
        console.log("Producto eliminado correctamente");
      });
  };

  return (
    <div className='admin-products d-flex flex-column h-100 w-100'>
      <AdminHeaderWithModal
        title="Administrar productos"
        buttonText="Agregar Producto"
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
              value={newProduct.descripcion} 
              onChange={handleChange}
              placeholder="Nombre del producto"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Categoría</Form.Label>
            <Form.Control
              as="select"
              name="id_categoria"
              value={newProduct.id_categoria}
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
      </AdminHeaderWithModal>
      <div className='admin-products-content flex-fill w-100'>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <>
            <AdminTable
              initialData={products}
              columns={columnsProducts}
              onEditSave={onEditSave}
              onDeleteConfirm={onDeleteConfirm}
              renderEditForm={(selectedItem, handleEditChange) => (
                <RenderEditProductForm
                  selectedItem={selectedItem}
                  handleEditChange={handleEditChange}
                  categories={categories}
                />
              )}
              editModalTitle="Editar Producto"
              deleteModalTitle="Confirmar Eliminación"
              deleteModalMessage="¿Estás seguro de que quieres eliminar este producto?" />
          </>
        )}
      </div>
    </div>
  );
}

export default AdminProductsPage;