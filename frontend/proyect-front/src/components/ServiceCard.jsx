import React from 'react';
import '../styles/serviceCard.css'; // Archivo de estilos para la tarjeta de servicio

const ServiceCard = ({ title, description, imgSrc }) => {
  return (
    <article className="col-md-4 mb-4">
      <div className="card">
        <img src={imgSrc} className="card-img-top" alt={`Descripción de ${title}`} />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
          <a href="#" className="btn btn-primary">Ver más</a>
        </div>
      </div>
    </article>
  );
};

export default ServiceCard;