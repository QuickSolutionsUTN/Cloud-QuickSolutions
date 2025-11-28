import { useContext } from 'react';
import { Link } from 'react-router-dom';
import UserRequestsList from '../components/users/UserRequestsList.jsx';
import AuthContext from '../contexts/AuthContext.jsx';
import "./userRequestsPage.css";

import 'bootstrap/dist/css/bootstrap.min.css';

export default function UserRequestsPage() {
    const { isAuthenticated } = useContext(AuthContext);

    if (!isAuthenticated) {
        return (
            <div className="container py-5 text-center">
                <h3>Debes iniciar sesión para ver tus solicitudes</h3>
                <Link to="/" className="btn btn-primary mt-3">Ir al inicio</Link>
            </div>
        );
    }

    return (
        <div className='container-fluid user-requests-page my-4'>
            <div className='row mb-4'>
                <div className='col-12 d-flex justify-content-between align-items-center'>
                    <h2 className='page-title'>
                        <i className="bi bi-list-task me-2"></i>
                        Mis Solicitudes
                    </h2>
                </div>
            </div>
            
            <div className='row'>
                <div className='col-12'>
                    <div className='card shadow-sm'>
                        <div className='card-body'>
                            <UserRequestsList />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}