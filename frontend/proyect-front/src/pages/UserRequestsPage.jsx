import React from 'react';
import { useContext } from 'react';
import UserRequestsList from '../components/users/UserRequestsList.jsx';
import AuthContext from '../contexts/AuthContext.jsx';
import "./userRequestsPage.css";


import 'bootstrap/dist/css/bootstrap.min.css';

export default function UserRequests() {
  const { userEmail } = useContext(AuthContext);

    return (
        <div className='container-fluid p-repairsRequestsList my-3 mx-3'>
            <div className='p-repairsRequestsList tittle'><h2>Listado de reparaciones</h2> </div>
            <div className='requestsPage-list'>
                <UserRequestsList userEmail={userEmail} />
            </div>
        </div>
    );
}