import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/axiosConfig';
import './requestDetails.css';

export default function RequestDetails({ solicitudId }) {
    const [solicitud, setSolicitud] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (solicitudId) {
            fetchSolicitud();
        }
    }, [solicitudId]);

    const fetchSolicitud = async () => {
        try {
            setLoading(true);
            const response = await apiService.getRequestById(solicitudId);
            setSolicitud(response.data);
        } catch (err) {
            setError('Error al cargar los detalles de la solicitud');
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

    const handleCancelar = async () => {
        if (window.confirm('¿Estás seguro de que deseas cancelar esta solicitud?')) {
            try {
                await apiService.cancelRequest(solicitudId);
                fetchSolicitud();
            } catch (err) {
                console.error('Error al cancelar:', err);
                alert(err.response?.data?.error || 'Error al cancelar la solicitud');
            }
        }
    };

    const handleAprobar = async () => {
        if (window.confirm('¿Deseas aprobar el presupuesto de esta solicitud?')) {
            try {
                await apiService.updateRequestUser({ id: solicitudId, accion: 'aprobar' });
                fetchSolicitud();
            } catch (err) {
                console.error('Error al aprobar:', err);
                alert(err.response?.data?.error || 'Error al aprobar la solicitud');
            }
        }
    };

    const handleRechazar = async () => {
        if (window.confirm('¿Deseas rechazar el presupuesto de esta solicitud?')) {
            try {
                await apiService.updateRequestUser({ id: solicitudId, accion: 'rechazar' });
                fetchSolicitud();
            } catch (err) {
                console.error('Error al rechazar:', err);
                alert(err.response?.data?.error || 'Error al rechazar la solicitud');
            }
        }
    };

    // Determinar qué pasos están activos según el estado
    const getTimelineStatus = (estado) => {
        const estadoLower = estado?.toLowerCase() || '';
        return {
            pendiente: ['pendiente', 'presupuestada', 'aprobada', 'en proceso', 'finalizada'].includes(estadoLower),
            presupuestada: ['presupuestada', 'aprobada', 'en proceso', 'finalizada'].includes(estadoLower),
            aprobada: ['aprobada', 'en proceso', 'finalizada'].includes(estadoLower),
            enProceso: ['en proceso', 'finalizada'].includes(estadoLower),
            finalizada: estadoLower === 'finalizada'
        };
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    if (error || !solicitud) {
        return (
            <div className="alert alert-danger">
                {error || 'Solicitud no encontrada'}
            </div>
        );
    }

    const timeline = getTimelineStatus(solicitud.estado);
    const estadoActual = solicitud.estado?.toLowerCase();

    return (
        <div className="request-details-container">
            {/* Header con estado */}
            <div className="card mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Solicitud #{solicitud.id}</h4>
                    <span className={`badge ${getEstadoBadge(solicitud.estado)} fs-6`}>
                        {getEstadoTexto(solicitud.estado)}
                    </span>
                </div>
                <div className="card-body">
                    {/* Timeline de estados */}
                    {estadoActual !== 'cancelada' && estadoActual !== 'rechazada' && (
                        <div className="status-timeline mb-4">
                            <div className={`timeline-step ${timeline.pendiente ? 'active' : ''}`}>
                                <div className="step-icon">1</div>
                                <span>Pendiente</span>
                            </div>
                            <div className={`timeline-step ${timeline.presupuestada ? 'active' : ''}`}>
                                <div className="step-icon">2</div>
                                <span>Presupuestada</span>
                            </div>
                            <div className={`timeline-step ${timeline.aprobada ? 'active' : ''}`}>
                                <div className="step-icon">3</div>
                                <span>Aprobada</span>
                            </div>
                            <div className={`timeline-step ${timeline.enProceso ? 'active' : ''}`}>
                                <div className="step-icon">4</div>
                                <span>En Proceso</span>
                            </div>
                            <div className={`timeline-step ${timeline.finalizada ? 'active' : ''}`}>
                                <div className="step-icon">5</div>
                                <span>Finalizada</span>
                            </div>
                        </div>
                    )}
                    
                    {/* Mensaje para estados cancelada/rechazada */}
                    {(estadoActual === 'cancelada' || estadoActual === 'rechazada') && (
                        <div className={`alert ${estadoActual === 'cancelada' ? 'alert-dark' : 'alert-danger'}`}>
                            <i className={`bi ${estadoActual === 'cancelada' ? 'bi-x-circle' : 'bi-exclamation-triangle'} me-2`}></i>
                            Esta solicitud ha sido {estadoActual}.
                        </div>
                    )}
                </div>
            </div>

            {/* Información general */}
            <div className="row">
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-header">
                            <h5 className="mb-0"><i className="bi bi-info-circle me-2"></i>Información General</h5>
                        </div>
                        <div className="card-body">
                            <dl className="row mb-0">
                                <dt className="col-sm-5">Tipo de Servicio:</dt>
                                <dd className="col-sm-7">{solicitud.tipoServicio || 'N/A'}</dd>

                                <dt className="col-sm-5">Fecha Solicitud:</dt>
                                <dd className="col-sm-7">
                                    {solicitud.fechaGeneracion ? new Date(solicitud.fechaGeneracion).toLocaleDateString('es-AR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }) : 'N/A'}
                                </dd>

                                <dt className="col-sm-5">Categoría:</dt>
                                <dd className="col-sm-7">{solicitud.categoria || 'N/A'}</dd>

                                <dt className="col-sm-5">Producto:</dt>
                                <dd className="col-sm-7">{solicitud.producto || 'N/A'}</dd>

                                <dt className="col-sm-5">Con Logística:</dt>
                                <dd className="col-sm-7">{solicitud.con_logistica ? 'Sí' : 'No'}</dd>
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-header">
                            <h5 className="mb-0"><i className="bi bi-currency-dollar me-2"></i>Información del Servicio</h5>
                        </div>
                        <div className="card-body">
                            <dl className="row mb-0">
                                <dt className="col-sm-5">Monto:</dt>
                                <dd className="col-sm-7 fw-bold text-success">
                                    {solicitud.monto ? `$${solicitud.monto}` : 'Pendiente de presupuesto'}
                                </dd>

                                <dt className="col-sm-5">Fecha Estimada:</dt>
                                <dd className="col-sm-7">
                                    {solicitud.fechaEstimada ? new Date(solicitud.fechaEstimada).toLocaleDateString('es-AR') : 'Por definir'}
                                </dd>

                                <dt className="col-sm-5">Fecha Finalizada:</dt>
                                <dd className="col-sm-7">
                                    {solicitud.fechaFinalizada ? new Date(solicitud.fechaFinalizada).toLocaleDateString('es-AR') : '-'}
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            {/* Descripción */}
            {solicitud.descripcion && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0"><i className="bi bi-card-text me-2"></i>Descripción del Problema</h5>
                    </div>
                    <div className="card-body">
                        <p className="mb-0">{solicitud.descripcion}</p>
                    </div>
                </div>
            )}

            {/* Diagnóstico Técnico */}
            {solicitud.diagnosticoTecnico && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0"><i className="bi bi-tools me-2"></i>Diagnóstico Técnico</h5>
                    </div>
                    <div className="card-body">
                        <p className="mb-0">{solicitud.diagnosticoTecnico}</p>
                    </div>
                </div>
            )}

            {/* Checklist de mantenimiento */}
            {solicitud.mantenimiento?.checklist && solicitud.mantenimiento.checklist.length > 0 && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0"><i className="bi bi-list-check me-2"></i>Tareas de Mantenimiento</h5>
                    </div>
                    <div className="card-body">
                        <ul className="list-group list-group-flush">
                            {solicitud.mantenimiento.checklist.map((item) => (
                                <li key={item.id} className="list-group-item">
                                    <i className="bi bi-check-circle text-success me-2"></i>
                                    {item.descripcion}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Acciones */}
            <div className="buttons-container">
                <button 
                    className="btn btn-secondary custom-button secondary"
                    onClick={() => navigate('/users/requests')}
                >
                    <i className="bi bi-arrow-left me-2"></i>Volver
                </button>
                
                {/* Botones para aprobar/rechazar presupuesto */}
                {estadoActual === 'presupuestada' && (
                    <>
                        <button 
                            className="btn btn-success custom-button"
                            onClick={handleAprobar}
                        >
                            <i className="bi bi-check-circle me-2"></i>Aprobar Presupuesto
                        </button>
                        <button 
                            className="btn btn-danger custom-button"
                            onClick={handleRechazar}
                        >
                            <i className="bi bi-x-circle me-2"></i>Rechazar Presupuesto
                        </button>
                    </>
                )}
                
                {/* Botón cancelar solo para estados pendiente/presupuestada */}
                {['pendiente', 'presupuestada'].includes(estadoActual) && (
                    <button 
                        className="btn btn-outline-danger custom-button"
                        onClick={handleCancelar}
                    >
                        <i className="bi bi-x-circle me-2"></i>Cancelar Solicitud
                    </button>
                )}
            </div>
        </div>
    );
}