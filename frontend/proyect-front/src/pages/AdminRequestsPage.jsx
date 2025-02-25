import React, { useEffect, useState } from "react";
import apiService from "../services/axiosConfig";
import { Button, Spinner } from "react-bootstrap";
import AdminRequestsTable from "../components/admin/AdminRequestsTable";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiService.getRequestsAdmin();
        const requests = response.data.map((request) => ({
          ...request,
          fechaGeneracion: new Date(request.fechaGeneracion).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }),
        }));
        setRequests(requests);
        setLoading(false);
      } catch (error) {
        console.error("Error: ", error);
      }
    };
    fetchData();
  }, []);

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Solicitudes", 14, 10);
    const columns = ["ID", "Servicio", "Fecha", "Producto", "Estado"];
    const rows = requests.map((item) => [
      item.id,
      item.tipoServicio,
      item.fechaGeneracion,
      item.estado,
      item.tipoDeProducto || "N/A",
    ]);
    autoTable(doc, {
      startY: 20, // Posición inicial
      head: [columns],
      body: rows,
    });

    doc.save("solicitudes.pdf");
  }

  const handleDownloadItem = (id) => {
    const solicitud = requests.find((item) => item.id === id);
    if (!solicitud) {
      console.error("Solicitud no encontrada");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Reporte de Solicitud", 14, 10);

    doc.setFontSize(12);
    const fields = [
      { label: "ID", value: solicitud.id },
      { label: "Descripción", value: solicitud.descripcion },
      { label: "Fecha Generación", value: solicitud.fechaGeneracion },
      { label: "Estado", value: solicitud.estado },
      { label: "Categoría", value: solicitud.categoria || "N/A" },
      { label: "Tipo de Producto", value: solicitud.tipoDeProducto },
      { label: "Email Solicitante", value: solicitud.emailSolicitante },
      { label: "Tipo de Servicio", value: solicitud.tipoServicio },
      { label: "Diagnóstico Técnico", value: solicitud.diagnosticoTecnico || "N/A" },
      { label: "Fecha Estimada", value: solicitud.fechaEstimada || "N/A" },
      { label: "Monto", value: `$${solicitud.monto}` },
      { label: "Resumen", value: solicitud.resumen || "No disponible" },
    ];

    let y = 20; // Posición inicial
    fields.forEach(({ label, value }) => {
      doc.text(`${label}: ${value}`, 14, y);
      y += 8;
    });

    doc.save(`solicitud_${id}.pdf`);
  }

  return (
    <div className="admin-requests d-flex flex-column h-100 w-100">
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <>
          <div className="admin-requests title m-2 d-flex flex-row justify-content-between">
            <h2>Solicitudes de Reparación</h2>
            <Button variant="outline-secondary" onClick={() => handleDownload()}>
              <FontAwesomeIcon icon={faArrowDown} />
            </Button>
          </div>
          <AdminRequestsTable
            initialData={requests}
            handleDownload={handleDownloadItem}
          />
        </>
      )}
    </div>
  );
}
