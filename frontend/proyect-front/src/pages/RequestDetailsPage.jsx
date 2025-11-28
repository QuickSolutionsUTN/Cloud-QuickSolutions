import { useParams, Link } from 'react-router-dom';
import { useContext } from 'react';
import RequestDetails from '../components/users/RequestDetails';
import AuthContext from '../contexts/AuthContext';
import './userRequestsPage.css';

export default function RequestDetailsPage() {
    const { id } = useParams();
    const { isAuthenticated } = useContext(AuthContext);

    if (!isAuthenticated) {
        return (
            <div className="container py-5 text-center">
                <h3>Debes iniciar sesión para ver esta solicitud</h3>
                <Link to="/" className="btn btn-primary mt-3">Ir al inicio</Link>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <RequestDetails solicitudId={id} />
        </div>
    );
}