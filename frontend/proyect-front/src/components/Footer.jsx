import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <p>© 2024 Mi Aplicación. Todos los derechos reservados.</p>
      <nav>
        <ul>
          <li><a href="/privacy">Política de Privacidad</a></li>
          <li><a href="/terms">Términos de Servicio</a></li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;