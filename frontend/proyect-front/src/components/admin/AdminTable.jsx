import React from "react";
import { useReactTable, getCoreRowModel, flexRender, getSortedRowModel } from "@tanstack/react-table";
import { useState, useEffect, useContext } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { faPenToSquare, faTrash, faSortUp, faSortDown, faSort } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './adminTable.css';

export default function AdminTable({
  initialData,
  columns: userColumns,
  onEditSave, 
  onDeleteConfirm, 
  renderEditForm, 
  validateEdit,
  editModalTitle = "Editar Elemento",
  deleteModalTitle = "Confirmar Eliminación",
  deleteModalMessage = "¿Estás seguro de que quieres eliminar este elemento?",
}) {
  const [data, setData] = useState(initialData);
  const [sorting, setSorting] = useState([{ id: 'id', desc: false }]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [editErrors, setEditErrors] = useState({});

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditErrors({});
    setShowEditModal(true);
  };
  const handleDelete = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const handleEditChange = (e) => {
    const updatedItem = {
      ...selectedItem,
      [e.target.name]: e.target.value,
    };
    setSelectedItem(updatedItem);
    setData(data.map(item => (item.id === updatedItem.id ? updatedItem : item)));
  };

  const handleSave = () => {
    if (!selectedItem) return;
    if (validateEdit) {
      try {
        const errors = validateEdit(selectedItem) || {};
        if (errors && Object.keys(errors).length > 0) {
          setEditErrors(errors);
          return;
        }
      } catch (err) {
        console.error('Validation function threw an error', err);
      }
    }
    setEditErrors({});

    if (onEditSave) {
      onEditSave(selectedItem)
        .then((updatedItem) => {
          setData(data.map(item => (item.id === updatedItem.id ? updatedItem : item)));
          setShowEditModal(false);
        })
        .catch((error) => {
          console.error("Error al guardar la edición:", error);
        });
    }
  };

  // Confirma la eliminación (llama al callback externo)
  const confirmDelete = () => {
    if (onDeleteConfirm && selectedId) {
      onDeleteConfirm(selectedId)
        .then(() => {
          setData(data.filter(item => item.id !== selectedId));
          setShowDeleteModal(false);
        })
        .catch((error) => {
          console.error("Error al eliminar el elemento:", error);
          setShowDeleteModal(false);
        });
    }
  };

  let columns = [...userColumns];
  if (onEditSave || onDeleteConfirm) {
    columns.push({
      header: "Acciones",
      cell: ({ row }) => (
        <>
          {onEditSave && (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleEdit(row.original)}
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </Button>
          )}
          {onDeleteConfirm && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleDelete(row.original.id)}
              style={{ marginLeft: '10px' }}
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          )}
        </>
      ),
      enableSorting: false,
    });
  }

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
      <table className="admin-table-component">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="sticky-col">
              {headerGroup.headers.map((header) => (
                <th key={header.id} onClick={header.column.getToggleSortingHandler()} className="px-3">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: <FontAwesomeIcon icon={faSortUp} className="sort-icon" />,
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
      {/* Modal de Edición */}
      {onEditSave && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editModalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedItem && renderEditForm
              ? renderEditForm(selectedItem, handleEditChange, editErrors)
              : null}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Guardar Cambios
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Modal de Eliminación */}
      {onDeleteConfirm && (
        <Modal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>{deleteModalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{deleteModalMessage}</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Eliminar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
