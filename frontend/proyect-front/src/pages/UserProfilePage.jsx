import React, { useState, useContext, useEffect } from 'react';
import { useBackendURL } from '../contexts/BackendURLContext';
import AddressCard from '../components/users/UserAddressCard.jsx';
import UserCard from '../components/users/UserProfileCard.jsx';
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

    const domicilio = userData.domicilio ?? null;
    const calleCompleta = domicilio?.calle
        ? `${domicilio.calle} ${domicilio.numero || ''} ${domicilio.piso || ''} ${domicilio.departamento || ''}`.trim()
        : 'No especificado';

    return (
        <div className='p-userprofile p-userprofile-container'>
            <div className='container-fluid p-userprofile card-container w-75'>
                    <UserCard user={userData} />
                    {domicilio == null ? (
                        <div className="alert alert-info mt-3 w-100 text-center">El usuario aun no tiene un domicilio registrado.</div>
                    ) : (
                    <AddressCard
                        street={calleCompleta}
                        city={domicilio.ciudad || 'No especificado'}
                        state={domicilio.provincia || 'No especificado'}
                        zipCode={domicilio.codigo_postal || 'No especificado'}
                        floor={domicilio.piso || 'No especificado'}
                        department={domicilio.departamento || 'No especificado'}
                    />
                    )}
            </div>
        </div>
    );
}