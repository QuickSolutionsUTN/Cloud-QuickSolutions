import React from "react";
import { useReactTable, getCoreRowModel, flexRender, getSortedRowModel } from "@tanstack/react-table";
import { useState, useEffect, useContext } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import axios from "axios";
import { useBackendURL } from '../../contexts/BackendURLContext.jsx';
import AuthContext from '../../contexts/AuthContext.jsx';
import { faPenToSquare, faTrash, faSortUp, faSortDown, faSort } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function AdminProductsTable({ initialProducts, categories }) {
  const [data, setData] = useState(initialProducts);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [sorting, setSorting] = useState([{ id: 'id', desc: false }]); // Ordenar por 'id' ascendente por defecto
  const backendURL = useBackendURL();
  const { userToken } = useContext(AuthContext);

  useEffect(() => {
    if (!initialProducts.length) {
      setData(initialProducts);
    }
  }, [initialProducts]);

  const handleEdit = (producto) => {
    setSelectedProduct(producto);
    setShowEditModal(true);
  };

  const handleChange = (e) => {
    setSelectedProduct({
      ...selectedProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    console.log("Guardando cambios en el producto:", selectedProduct);
    const id = selectedProduct.id;
    axios.put(`${backendURL}/api/tipoproducto/${id}`, selectedProduct, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    })
      .then(() => {
        setData(data.map(p => (p.id === id ? selectedProduct : p)));
        console.log("Producto actualizado correctamente");
        setShowEditModal(false);
      })
      .catch((error) => {
        console.error("Error al actualizar el producto:", error);
      });
  };

  // Manejo de eliminación: abre el modal de confirmación
  const handleDelete = (id) => {
    console.log("Eliminar producto con id:", id);
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  // Confirma la eliminación
  const confirmDelete = () => {
    if (selectedId) {
      axios
        .delete(`${backendURL}/api/tipoproducto/${selectedId}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then(() => {
          setData(data.filter((p) => p.id !== selectedId));
          setShowDeleteModal(false);
        })
        .catch((error) => {
          console.error("Error al eliminar el producto:", error);
          setShowDeleteModal(false);
        });
    }
  };

  const columns = [
    { accessorKey: "id", header: "ID", enableSorting: true },
    { accessorKey: "descripcion", header: "Nombre" },
    {
      accessorKey: "idCategoria",
      header: "Categoría",
      cell: ({ row }) => {
        const categoria = categories.find(cat => cat.id === row.original.idCategoria);
        return categoria ? categoria.descripcion : 'Categoría no encontrada';
      },
    },
    {
      header: "Acciones",
      cell: ({ row }) => (
        <>
          <Button onClick={() => handleEdit(row.original)} className="btn btn-edit" variant="outline-primary">
            <FontAwesomeIcon icon={faPenToSquare} />
          </Button>
          <Button onClick={() => handleDelete(row.original.id)} className="btn btn-delete" variant="outline-danger" style={{ marginLeft: '10px' }}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </>
      ),
    enableSorting: false,},
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="table-container">
      <table className="admin-products-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="sticky-col">
              {headerGroup.headers.map((header) => (
                <th key={header.id} onClick={header.column.getToggleSortingHandler()} className="px-3">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: <FontAwesomeIcon icon={faSortUp} className="sort-icon"/>,
                    desc: <FontAwesomeIcon icon={faSortDown} className="sort-icon" />,
                  }[header.column.getIsSorted()] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <Form>
              <Form.Group>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="descripcion"
                  value={selectedProduct.descripcion}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Categoría</Form.Label>
                <Form.Control
                  as="select"
                  name="idCategoriaProducto"
                  value={selectedProduct.idCategoriaProducto}
                  onChange={handleChange}
                >
                  {categories.map((category, index) => (
                    <option key={index} value={category.id}>
                      {category.descripcion}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave}>Guardar Cambios</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que quieres eliminar este elemento?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
