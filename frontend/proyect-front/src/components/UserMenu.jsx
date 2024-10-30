import React from "react";
import { useNavigate } from "react-router-dom";
import "./userMenu.css";

const UserMenu = ({ onLogoutClick, onMouseLeave, role }) => {
    const navigate = useNavigate();
    const handleAdminClick = () => {
        navigate('/admin');
    };
    const handleHomeClick = () => {
        navigate('/');
    };

    return (
        <div className="options" onMouseLeave={onMouseLeave}>
            <div className="opc-top"><button>Mi perfil</button></div>
            <div className="opc"><button>Mis solicitudes</button></div>
            {role === 'admin' && ( 
                <>
                    <div className="divider"></div>
                    <div className="opc-admin">
                        {location.pathname === '/admin' ? (
                        <button onClick={handleHomeClick}>Inicio</button>
                        ) : (
                        <button onClick={handleAdminClick}>Menu Admin</button>)}
                    </div>
                </>
            )}
            <div className="divider"></div>
            <div className="close"> <button onClick={onLogoutClick}>Cerrar sesion</button></div>
        </div>
    );
};
export default UserMenu;