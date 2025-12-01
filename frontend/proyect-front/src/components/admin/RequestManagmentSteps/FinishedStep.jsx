import React from 'react';
import SummaryCard from './SummaryCard.jsx';

const FinishedStep = ({ solicitud }) => {
  return (
    <div className="fade-in-animation">
       <SummaryCard text={solicitud.Resumen || solicitud.resumen} />
       
       <div className="text-center mt-4 text-success">
          <small>La solicitud se ha completado exitosamente.</small>
       </div>
    </div>
  );
};
export default FinishedStep;