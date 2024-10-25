import React from 'react';
import './DropDownCard.css';

const DropDownCard = ({title, content}) => {
  return (
    <div className="info-section">
      <h6>{title}</h6>
      <hr />
      <p>{content}</p>
    </div>
  );
};

export default DropDownCard;