import React from 'react';
import { useState, useContext, useEffect } from 'react';
import { useBackendURL } from '../contexts/BackendURLContext';
import UserRequestsList from '../components/users/UserRequestsList.jsx';
import UserCard from '../components/users/UserProfileCard.jsx';
import PersonalInfoCard from '../components/users/UserPersonalInfoCard.jsx';
import AddressCard from '../components/users/UserAddressCard.jsx';
import AuthContext from '../contexts/AuthContext.jsx';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import './userProfilePage.css';

export default function UserProfile() {
    const backendURL = useBackendURL();
    const { userToken } = useContext(AuthContext);
    const [userData, setUserData] = useState([]);

    useEffect(() => {
      const fetchUserData = async () => {
          try {
              console.log('Fetching user data...', backendURL);
              const response = await axios.get(`${backendURL}/api/users/me`, {
                  headers: {
                      Authorization: `Bearer ${userToken}`,
                  },
              });
              console.log('User data:', response.data);
              setUserData(response.data);
          } catch (error) {
              console.error('Error fetching user data:', error);
          }
      };
      fetchUserData();
  }, [backendURL, userToken]);

    return (
        <div className='p-userprofile p-userprofile-container my-3 mx-3'>
            <div className='container-fluid p-userprofile card-container'>
                <UserCard
                    name={userData.nombre + ' ' + userData.apellido}
                    image='https://img.freepik.com/vector-gratis/circulo-azul-usuario-blanco_78370-4707.jpg?t=st=1737921708~exp=1737925308~hmac=5909ba76d7c35d32a51f336ccd9d121802541b6cda2565c78b203df1edbcf79b&w=740'
                />
                <div className='p-userprofile right-cards'>
                    <PersonalInfoCard
                        email={userData.email}
                        birthDate={userData.fechaDeNacimiento}
                    />
                    <AddressCard
                        street='Av. del Petroleo Argentino 417'
                        city='Berisso'
                        state='Buenos Aires'
                        zipCode='1924'
                        country='Argentina'

                    />
                </div>
            </div>
        </div>
    );
}