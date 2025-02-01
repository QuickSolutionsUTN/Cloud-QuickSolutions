import React from "react";
import img_link from '../assets/logos/logo_white.png';
import { faLocationDot, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './footer.css';

const Footer = () => {
  return (
    <footer className="p-footer-container container-fluid light-mode footer">
      <div className="footer_content">
        <div className="footer_column" style={{ left: '0' }}>
          <div className="footer_contact column">
            <div className="footer_title"><h4>Contacto</h4></div>
            <div className="footer_contact container">
              <div className="footer_contact content">
                <div className="footer_text">
                  <FontAwesomeIcon icon={faLocationDot} className="custom-icon" />
                  Av. del Petroleo Argentino 417, Berisso, 1924
                </div>
                <div className="footer_text">
                  <FontAwesomeIcon icon={faPhone} className="custom-icon" />
                  Tel: 221-555-5555</div>
                <div className="footer_text">
                  <FontAwesomeIcon icon={faEnvelope} className="custom-icon" />
                  contacto@quicksolutions.com</div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer_column" style={{ left: '50%', transform: 'translateX(-50%)' }}>
          <div className="footer_social column">
            <div className="footer_logo column text-center">
              <img src={img_link} alt="Logo de Quick Solutions en blanco" />
            </div>
            <div className="footer_social container text-center"> {/* Center the content */}
              <div className="footer_title"><h4>Siguenos</h4></div>
              <div className="footer_text">
                <FontAwesomeIcon icon={faInstagram} className="icon" />
                <FontAwesomeIcon icon={faFacebook} className="icon" />
              </div>
            </div>
          </div>
        </div>

        <div className="footer_column" style={{ right: '0' }}>
          <div className="footer_links column right">
            <h4>Recursos y links</h4>
            <div className="footer_text">
              <a href="/sobre-nosotros" className="footer_link">Sobre Nosotros</a>
              <a href="/sobre-nosotros" className="footer_link">Preguntas frecuentes</a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer_bottom text-center">
        <div className="footer_text">
        </div>
        <p>© 2025 Quick Solutions</p>
      </div>
    </footer>
  );
};

export default Footer;
