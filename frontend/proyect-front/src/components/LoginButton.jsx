import Button from 'react-bootstrap/Button';

function LoginButton({ onLoginClick }) {
  return (
    <div className='auth-btn'>
      <Button variant="outline-light" onClick={onLoginClick}>Iniciar Sesión</Button>
    </div>
  );
}

export default LoginButton;