import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

const BudgetCard = ({ fecha, monto }) => {
  
  // Helpers para formateo
  const formattedDate = fecha 
    ? new Date(fecha).toLocaleDateString('es-AR') 
    : null;

  const formattedAmount = monto 
    ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(monto)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }} // Un pequeño delay para que aparezca después de la descripción
      className="description-card h-100" // Reusamos tu clase CSS
      style={{ borderLeft: '4px solid #198754' }} // Color Verde (Success) para diferenciarlo
    >
      <div className="row h-100 align-items-center">
        
        <div className="col-md-6 mb-3 mb-md-0 position-relative">
          <div className="section-label mb-1" style={{ fontSize: '0.75rem' }}>Fecha Estimada</div>
          <div className="d-flex align-items-center">
            <div className="icon-wrapper me-3 d-flex align-items-center justify-content-center" 
                 style={{ width: '40px', height: '40px', background: '#f8f9fa', borderRadius: '8px' }}>
              <FontAwesomeIcon icon={faCalendarAlt} className="text-secondary opacity-75" />
            </div>
            
            {formattedDate ? (
              <span className="fs-5 fw-medium text-dark">{formattedDate}</span>
            ) : (
              <span className="text-muted fst-italic">A confirmar</span>
            )}
          </div>
          
          <div className="d-none d-md-block" 
               style={{ position: 'absolute', right: 0, top: '10%', height: '80%', borderRight: '1px solid #eee' }}>
          </div>
        </div>

        <div className="col-md-6 ps-md-4">
          <div className="section-label mb-1" style={{ fontSize: '0.75rem' }}>Presupuesto Total</div>
          <div className="d-flex align-items-center">
             <div className="icon-wrapper me-3 d-flex align-items-center justify-content-center" 
                 style={{ width: '40px', height: '40px', background: '#d1e7dd', borderRadius: '8px' }}>
              <FontAwesomeIcon icon={faMoneyBillWave} className="text-success" />
            </div>

            {formattedAmount ? (
              <span className="fs-4 fw-bold text-success" style={{ letterSpacing: '-0.5px' }}>
                {formattedAmount}
              </span>
            ) : (
              <span className="text-muted fst-italic">Sin cotizar</span>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default BudgetCard;