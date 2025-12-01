import React from 'react';
import CancellationCard from './CancellationCard';

const CancelStep = ({ solicitud }) => {
  return (
    <div className="fade-in-animation">
       <CancellationCard reason={solicitud.resumen || solicitud.Resumen} />
    </div>
  );
};
export default CancelStep;