import React, { useState, useContext, useEffect } from 'react';
import { useBackendURL } from '../contexts/BackendURLContext';
import AddressCard from '../components/users/UserAddressCard.jsx';
import UserCard from '../components/users/UserProfileCard.jsx';
import UserAddressModal from '../components/users/UserAddressModal.jsx';
import AuthContext from '../contexts/AuthContext.jsx';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import './userProfilePage.css';

export default function UserProfile() {
    const backendURL = useBackendURL();
    const { user, userToken } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(false);
    const [modalInitialData, setModalInitialData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                console.log('Obteniendo datos del usuario...', user.id);
                const response = await axios.get(`${backendURL}/api/perfiles/${user.id}/`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });
                console.log('Datos recibidos:', response.data);
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [backendURL, user, userToken]);

    if (loading) {
        return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;
    }

    if (!userData) {
        return <div className="alert alert-warning m-3">No se pudo cargar el perfil.</div>;
    }

    const domicilio = userData.domicilio ?? null;
    const calleCompleta = domicilio?.calle
        ? `${domicilio.calle} ${domicilio.numero || ''} ${domicilio.piso || ''} ${domicilio.departamento || ''}`.trim()
        : 'No especificado';

    const handleDeleteDomicilio = async () => {
        if (!window.confirm('¿Confirma que desea eliminar su domicilio?')) return;
        try {
            await axios.delete(`${backendURL}/api/perfiles/${user.id}/domicilio`, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            const resp = await axios.get(`${backendURL}/api/perfiles/${user.id}/`, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            setUserData(resp.data);
            alert('Domicilio eliminado correctamente.');
        } catch (err) {
            console.error('Error deleting domicilio:', err);
            alert('No se pudo eliminar el domicilio. Ver consola para más detalles.');
        }
    };

    return (
        <div className='d-flex flex-column '>
            <div className='container-fluid p-userprofile card-container w-75'>
                <UserCard user={userData} />
                {domicilio == null ? (
                    <div className="alert alert-info mt-3 w-100 text-center">
                        <div>El usuario aun no tiene un domicilio registrado.</div>
                        <div className="mt-2">
                            <button className="btn btn-sm btn-primary" onClick={() => { setModalInitialData(null); setEditingAddress(false); setShowAddressModal(true); }}>
                                Registrar domicilio
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="d-flex justify-content-between align-items-start">
                            <AddressCard
                                street={domicilio.calle || 'No especificado'}
                                province={domicilio.provincia || 'No especificado'}
                                locality={domicilio.localidad_nombre || 'No especificado'}
                                zipCode={domicilio.codigo_postal || 'No especificado'}
                                floor={domicilio.piso || 'No especificado'}
                                department={domicilio.departamento || 'No especificado'}
                            />
                        </div>
                        <div className=" d-flex flex-column">
                                <button className="btn btn-outline-secondary btn-sm mb-2" onClick={() => { setModalInitialData(domicilio); setEditingAddress(true); setShowAddressModal(true); }}>
                                    Modificar domicilio
                                </button>
                                <button className="btn btn-outline-danger btn-sm" onClick={handleDeleteDomicilio}>
                                    Eliminar domicilio
                                </button>
                            </div>
                    </div>
                )}

                <UserAddressModal
                    show={showAddressModal}
                    onClose={() => setShowAddressModal(false)}
                    initialData={modalInitialData}
                    onSubmit={async (formData) => {
                        try {
                            const payload = { ...formData };
                            if (payload.id_localidad) {
                                payload.localidad = payload.id_localidad;
                                delete payload.id_localidad;
                            }
                            delete payload.provincia; 
                            if (payload.departamento === "") payload.departamento = null;
                            if (payload.piso === "") payload.piso = null;
                            console.log('Guardando domicilio con payload:', payload);
                            console.log("Token actual:", userToken);
                            await axios.put(`${backendURL}/api/perfiles/${user.id}/domicilio`, payload, {
                                headers: { Authorization: `Bearer ${userToken}` }
                            });
                            const resp = await axios.get(`${backendURL}/api/perfiles/${user.id}/`, {
                                headers: { Authorization: `Bearer ${userToken}` }
                            });
                            setUserData(resp.data);
                            setShowAddressModal(false);
                        } catch (err) {
                            console.error('Error saving domicilio:', err);
                            alert('Error al guardar el domicilio. Ver consola para más detalles.');
                        }
                    }}
                />
            </div>
        </div>
    );
}