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
            'iniciada': 'bg-primary',
            'revisada': 'bg-secondary',
            'presupuestada': 'bg-info',
            'aprobada': 'bg-success',
            'rechazada': 'bg-danger',
            'finalizada': 'bg-dark',
            'cancelada': 'bg-danger'
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

    const handleAprobarSolicitud = (solicitudId) => {
        toast.info(
            <div className="toast-confirm">
                <p className="mb-2">¿Aprobar el presupuesto de esta solicitud?</p>
                <div className="d-flex gap-2 justify-content-end">
                    <button 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => toast.dismiss()}
                    >
                        Cancelar
                    </button>
                    <button 
                        className="btn btn-sm btn-success"
                        onClick={() => confirmarAprobacion(solicitudId)}
                    >
                        Sí, aprobar
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

    const confirmarAprobacion = async (solicitudId) => {
        toast.dismiss();
        try {
            await apiService.updateRequestUser({ id: solicitudId, accion: 'aprobar' });
            toast.success('Presupuesto aprobado exitosamente');
            fetchSolicitudes();
        } catch (err) {
            console.error('Error al aprobar solicitud:', err);
            toast.error(err.response?.data?.error || 'Error al aprobar la solicitud');
        }
    };

    const handleRechazarSolicitud = (solicitudId) => {
        toast.warn(
            <div className="toast-confirm">
                <p className="mb-2">¿Rechazar el presupuesto de esta solicitud?</p>
                <div className="d-flex gap-2 justify-content-end">
                    <button 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => toast.dismiss()}
                    >
                        Cancelar
                    </button>
                    <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => confirmarRechazo(solicitudId)}
                    >
                        Sí, rechazar
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

    const confirmarRechazo = async (solicitudId) => {
        toast.dismiss();
        try {
            await apiService.updateRequestUser({ id: solicitudId, accion: 'rechazar' });
            toast.success('Presupuesto rechazado');
            fetchSolicitudes();
        } catch (err) {
            console.error('Error al rechazar solicitud:', err);
            toast.error(err.response?.data?.error || 'Error al rechazar la solicitud');
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
                        className={`filter-pill ${filtroEstado === 'iniciada' ? 'active pending' : ''}`}
                        onClick={() => setFiltroEstado('iniciada')}
                    >
                        Iniciadas
                    </button>
                    <button 
                        className={`filter-pill ${filtroEstado === 'revisada' ? 'active reviewed' : ''}`}
                        onClick={() => setFiltroEstado('revisada')}
                    >
                        Revisadas
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
                        className={`filter-pill ${filtroEstado === 'finalizada' ? 'active finished' : ''}`}
                        onClick={() => setFiltroEstado('finalizada')}
                    >
                        Finalizadas
                    </button>
                    <button 
                        className={`filter-pill ${filtroEstado === 'cancelada' ? 'active cancelled' : ''}`}
                        onClick={() => setFiltroEstado('cancelada')}
                    >
                        Canceladas
                    </button>
                    <button 
                        className={`filter-pill ${filtroEstado === 'rechazada' ? 'active rejected' : ''}`}
                        onClick={() => setFiltroEstado('rechazada')}
                    >
                        Rechazadas
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
                                            {solicitud.estado?.toLowerCase() === 'presupuestada' && (
                                                <>
                                                    <button 
                                                        className="action-btn approve-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleAprobarSolicitud(solicitud.id);
                                                        }}
                                                        title="Aprobar presupuesto"
                                                    >
                                                        <i className="bi bi-check-circle"></i>
                                                        <span>Aprobar</span>
                                                    </button>
                                                    <button 
                                                        className="action-btn reject-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRechazarSolicitud(solicitud.id);
                                                        }}
                                                        title="Rechazar presupuesto"
                                                    >
                                                        <i className="bi bi-x-circle"></i>
                                                        <span>Rechazar</span>
                                                    </button>
                                                </>
                                            )}
                                            {solicitud.estado?.toLowerCase() === 'iniciada' && (
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