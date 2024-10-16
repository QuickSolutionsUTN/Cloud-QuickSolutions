import Button from 'react-bootstrap/Button';

function LogoutButton({ onLogoutClick }) {
  return (
    <div className='logout-btn'>
      <Button variant="outline-light" onClick={onLogoutClick}>Cerrar Sesión</Button>
    </div>
  );
}

export default LogoutButton;