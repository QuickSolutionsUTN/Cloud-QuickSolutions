import Button from 'react-bootstrap/Button';

function LogoutButton({ onLogoutClick }) {
  return (
    <div className='auth-btn'>
      <Button variant="outline-light" onClick={onLogoutClick}>Cerrar Sesión</Button>
    </div>
  );
}

export default LogoutButton;