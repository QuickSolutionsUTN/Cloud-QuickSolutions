import React from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { useState, useEffect, useContext } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import axios from "axios";
import { useBackendURL } from '../../contexts/BackendURLContext.jsx';
import AuthContext from '../../contexts/AuthContext.jsx';

export default function AdminProductsTable({ initialProducts, categories }) {
  const [data, setData] = useState(initialProducts);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const backendURL = useBackendURL();
  const { userToken } = useContext(AuthContext);

  useEffect(() => {
    if (!initialProducts.length) {
      setData(initialProducts); 
    }
  }, [initialProducts]);

  const handleEdit = (producto) => {
    setSelectedProduct(producto);
    setShowModal(true);
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
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Error al actualizar el producto:", error);
      });
  };

  const columns = [
    { accessorKey: "id", header: "ID" },
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
        <button onClick={() => handleEdit(row.original)} className="btn btn-primary">
          Editar
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="sticky-col">
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
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
      <Modal show={showModal} onHide={() => setShowModal(false)}>
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave}>Guardar Cambios</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
