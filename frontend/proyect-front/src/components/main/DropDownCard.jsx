import React from 'react';
import './dropDownCard.css';

const DropDownCard = ({title, content}) => {
  return (
    <div className="info-section">
      <h6>{title}</h6>
      <hr />
      <p className='ddc'>{content}</p>
    </div>
  );
};

export default DropDownCard;