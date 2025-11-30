import { useState, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import logo from "../assets/logos/logo.png";
import './adminLayout.css';
import AuthContext from '../contexts/AuthContext.jsx';
import AsideBar from '../components/admin/AdminsideBar.jsx';
import UserMenu from '../components/UserMenu.jsx';
import user from '../assets/logos/user-white.png';

function AdminLayout() {
  const { userName, userSurName, logout, userRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const onLogoutClick = () => {
    logout();
    console.log("Clickeo cerrar sesion");
  };

  const handleLogoClick = () => {
    navigate('/admin');
  };

  return (
    <>
      <div className="admin-layout">
        <header className="admin-header">
          <div className='admin-header-logo'>
            <img src={logo} onClick={handleLogoClick}/>
          </div>
          <div className="admin-user-menu-container">

            <span className="admin-user-text">Bienvenido, <strong>{userName} {userSurName}</strong></span>
            <button className="user-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
              <img src={user} alt="User" className="user-avatar" />
            </button>
            {showUserMenu && (
              <UserMenu
                onLogoutClick={onLogoutClick}
                onMouseLeave={() => setShowUserMenu(false)}
                role={userRole}
              />
            )}
          </div>
        </header>
        <div className="admin-content-container">
          <aside className="admin-sidebar">
            <AsideBar />
          </aside>
          < div className="admin-content container-fluid">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
export default AdminLayout;