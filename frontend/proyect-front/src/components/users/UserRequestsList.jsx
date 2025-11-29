import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiService from '../../services/axiosConfig';
import './userRequestsList.css';

export default function UserRequestsList() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const navigate = useNavigate();

    useEffect(() => {
        fetchSolicitudes();
    }, []);

    const fetchSolicitudes = async () => {
        try {
            setLoading(true);
            const response = await apiService.getUserRequests();
            setSolicitudes(response.data);
        } catch (err) {
            setError('Error al cargar las solicitudes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getEstadoBadge = (estado) => {
        const estados = {
            'pendiente': 'bg-warning text-dark',
            'presupuestada': 'bg-info text-dark',
            'aprobada': 'bg-success',
            'rechazada': 'bg-danger',
            'en proceso': 'bg-primary',
            'finalizada': 'bg-secondary',
            'cancelada': 'bg-dark'
        };
        return estados[estado?.toLowerCase()] || 'bg-secondary';
    };

    const getEstadoTexto = (estado) => {
        return estado || 'Sin estado';
    };

    const handleVerDetalle = (solicitudId) => {
        navigate(`/users/requests/${solicitudId}`);
    };

    const handleCancelarSolicitud = (solicitudId) => {
        toast.warn(
            <div className="toast-confirm">
                <p className="mb-2">¿Estás seguro de que deseas cancelar esta solicitud?</p>
                <div className="d-flex gap-2 justify-content-end">
                    <button 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => toast.dismiss()}
                    >
                        No
                    </button>
                    <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => confirmarCancelacion(solicitudId)}
                    >
                        Sí, cancelar
                    </button>
                </div>
            </div>,
            {
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false,
            }
        );
    };

    const confirmarCancelacion = async (solicitudId) => {
        toast.dismiss();
        
        try {
            await apiService.cancelRequest(solicitudId);
            toast.success('Solicitud cancelada exitosamente');
            fetchSolicitudes();
        } catch (err) {
            console.error('Error al cancelar solicitud:', err);
            toast.error(err.response?.data?.error || 'Error al cancelar la solicitud');
        }
    };

    const solicitudesFiltradas = solicitudes.filter(sol => {
        if (filtroEstado === 'todos') return true;
        return sol.estado?.toLowerCase() === filtroEstado.toLowerCase();
    });

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                {error}
            </div>
        );
    }

    return (
        <div className="user-requests-container">
            {/* Filtros */}
            <div className="filtros-container mb-4">
                <div className="filter-pills" role="group">
                    <button 
                        className={`filter-pill ${filtroEstado === 'todos' ? 'active' : ''}`}
                        onClick={() => setFiltroEstado('todos')}
                    >
                        Todas
                    </button>
                    <button 
                        className={`filter-pill ${filtroEstado === 'pendiente' ? 'active pending' : ''}`}
                        onClick={() => setFiltroEstado('pendiente')}
                    >
                        Pendientes
                    </button>
                    <button 
                        className={`filter-pill ${filtroEstado === 'presupuestada' ? 'active quoted' : ''}`}
                        onClick={() => setFiltroEstado('presupuestada')}
                    >
                        Presupuestadas
                    </button>
                    <button 
                        className={`filter-pill ${filtroEstado === 'aprobada' ? 'active approved' : ''}`}
                        onClick={() => setFiltroEstado('aprobada')}
                    >
                        Aprobadas
                    </button>
                    <button 
                        className={`filter-pill ${filtroEstado === 'en proceso' ? 'active in-progress' : ''}`}
                        onClick={() => setFiltroEstado('en proceso')}
                    >
                        En Proceso
                    </button>
                    <button 
                        className={`filter-pill ${filtroEstado === 'finalizada' ? 'active finished' : ''}`}
                        onClick={() => setFiltroEstado('finalizada')}
                    >
                        Finalizadas
                    </button>
                </div>
            </div>

            {/* Lista de solicitudes */}
            {solicitudesFiltradas.length === 0 ? (
                <div className="text-center py-5">
                    <i className="bi bi-inbox fs-1 text-muted"></i>
                    <p className="text-muted mt-3">No tienes solicitudes {filtroEstado !== 'todos' ? `con estado "${getEstadoTexto(filtroEstado)}"` : ''}</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Código</th>
                                <th>Tipo de Servicio</th>
                                <th>Producto</th>
                                <th>Fecha Solicitud</th>
                                <th>Estado</th>
                                <th>Monto</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {solicitudesFiltradas.map((solicitud) => (
                                <tr key={solicitud.id}>
                                    <td>{solicitud.id}</td>
                                    <td>{solicitud.tipoServicio || 'N/A'}</td>
                                    <td>{solicitud.producto || 'N/A'}</td>
                                    <td>{new Date(solicitud.fechaGeneracion).toLocaleDateString('es-AR')}</td>
                                    <td>
                                        <span className={`badge ${getEstadoBadge(solicitud.estado)}`}>
                                            {getEstadoTexto(solicitud.estado)}
                                        </span>
                                    </td>
                                    <td>{solicitud.monto ? `$${solicitud.monto}` : '-'}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button 
                                                className="action-btn view-btn"
                                                onClick={() => handleVerDetalle(solicitud.id)}
                                                title="Ver detalle"
                                            >
                                                <i className="bi bi-eye"></i>
                                                <span>Ver</span>
                                            </button>
                                            {['pendiente', 'presupuestada'].includes(solicitud.estado?.toLowerCase()) && (
                                                <button 
                                                    className="action-btn cancel-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCancelarSolicitud(solicitud.id);
                                                    }}
                                                    title="Cancelar solicitud"
                                                >
                                                    <i className="bi bi-x-circle"></i>
                                                    <span>Cancelar</span>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}