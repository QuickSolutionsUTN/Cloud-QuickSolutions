import React, { useState, useEffect, useContext } from 'react';
import { useReactTable, getCoreRowModel, flexRender, getSortedRowModel } from "@tanstack/react-table";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown, faArrowDown, faSquare } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import apiService from '../../services/axiosConfig.jsx';
import './adminRequests.css'

function AdminRequestsTable({ initialData , handleDownload}) {
  const [data, setData] = useState(initialData);
  const [sorting, setSorting] = useState([{ id: 'id', desc: true }]);
  const navigate = useNavigate();

  const columns = [
    { accessorKey: "id", header: "ID", enableSorting: true },
    {
      accessorKey: "tipoServicio",
      header: "Servicio",
      cell: ({ row }) => {
        const type = row.original.tipoServicio;
        const typeColors = {
          "Reparacion": "warning",
          "mantenimiento": "primary",
        };
        return (
          <div className="d-flex align-items-center gap-2">
            <span className={`badge text-${typeColors[type] || "secondary"} fs-6`}>
              <FontAwesomeIcon className={`me-2 text-${typeColors[type]}`} icon={faSquare} />
            </span>
            <span>{type}</span>
          </div>
        );
      },
    },
    { accessorKey: "emailSolicitante", header: "Cliente" },
    { accessorKey: "fechaGeneracion", header: "Fecha" },
    { accessorKey: "tipoDeProducto", header: "Producto" },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const estado = row.original.estado;

        const estadoColors = {
          "Iniciada": "primary",
          "Finalizada": "success",
          "Cancelada": "danger",
          "Presupuestada": "warning",
          "Aprobada": "info"
        };

        return (
          <span className={`badge w-75 text-${estadoColors[estado] || "secondary"} border border-${estadoColors[estado] || "secondary"} fs-6`}>
            {estado}
          </span>

        );
      },
    },
  ];

  if (initialData) {
    columns.push({
      header: "Acciones",
      cell: ({ row }) => (
        <>
          <Button
            variant="outline-success"
            size="sm"
            onClick={() => navigate(`./${row.original.id}`)}
          >
            Gestionar
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => handleDownload(row.original.id)}
            style={{ marginLeft: '10px' }}
          >
            <FontAwesomeIcon icon={faArrowDown} />
          </Button>

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
      <table className="admin-requests-table">
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
    </div>
  );
}

export default AdminRequestsTable;