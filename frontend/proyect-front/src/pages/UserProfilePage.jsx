import React, { useState, useContext, useEffect } from 'react';
import { useBackendURL } from '../contexts/BackendURLContext';
import AddressCard from '../components/users/UserAddressCard.jsx';
import AuthContext from '../contexts/AuthContext.jsx';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import './userProfilePage.css';

export default function UserProfile() {
    const backendURL = useBackendURL();
    const { user, userToken } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

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
    const formatLabel = (key) => {
        if (!key) return '';
        return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    };

    const formatValue = (value) => {
        if (value === null || value === undefined || value === '') return <em>No especificado</em>;
        if (typeof value === 'string' && /\d{4}-\d{2}-\d{2}T?/.test(value)) {
            return value.split('T')[0];
        }
        if (typeof value === 'boolean') return value ? 'Sí' : 'No';
        return String(value);
    };

    const hiddenKeys = new Set(['id', 'rol', 'role']);

    return (
        <div className='p-userprofile p-userprofile-container'>
            <div className='container-fluid p-userprofile card-container w-75'>
                    <div className='personal-info-card card mt-3 mb-3 p-3'>
                        <div className='card-body'>
                            <h5 className='fw-bold fs-4 address-card-title text-start'>Información del perfil</h5>
                            <div className='profile-details'>
                                {Object.entries(userData)
                                    .filter(([key]) => !hiddenKeys.has(key))
                                    .map(([key, value]) => (
                                        typeof value !== 'object' && (
                                            <div className='card-text address-card-text text-start' key={key}>
                                                <strong>{formatLabel(key)}:</strong> {formatValue(value)}
                                            </div>
                                        )
                                    ))}
                            </div>
                        </div>
                    </div>
                    <AddressCard
                        street='Av. del Petroleo Argentino 417'
                        city='Berisso'
                        state='Buenos Aires'
                        zipCode='1924'
                        country='Argentina'
                    />
            </div>
        </div>
    );
}