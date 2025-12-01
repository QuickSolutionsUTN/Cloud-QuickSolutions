import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const CancellationCard = ({ reason }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="description-card h-100"
      style={{ 
        borderLeft: '4px solid #dc3545',
        backgroundColor: '#fff5f5'
      }} 
    >
      <div className="d-flex flex-column h-100">
        
        <div className="d-flex align-items-center mb-3 pb-2 border-bottom" style={{ borderColor: 'rgba(220, 53, 69, 0.1)' }}>
            <div className="icon-wrapper me-2 d-flex align-items-center justify-content-center" 
                 style={{ width: '32px', height: '32px', background: '#f8d7da', borderRadius: '6px' }}>
              <FontAwesomeIcon icon={faBan} style={{ color: '#dc3545' }} />
            </div>
            <span className="fw-bold text-danger" style={{ fontSize: '0.9rem' }}>
              Solicitud Cancelada
            </span>
        </div>

        <div className="flex-grow-1">
          <div className="section-label mb-2" style={{ color: '#dc3545', opacity: 0.8 }}>
            Motivo de cancelación
          </div>
          
          {reason ? (
            <span style={{ whiteSpace: 'pre-wrap', color: '#842029', fontWeight: 500 }}>
              "{reason}"
            </span>
          ) : (
            <span className="text-muted fst-italic">
              No se especificó un motivo para la cancelación.
            </span>
          )}
        </div>

        <div className="mt-3 pt-2 d-flex align-items-center text-muted" style={{ fontSize: '0.75rem' }}>
            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2 text-warning" />
            <span>Este proceso no se puede revertir.</span>
        </div>

      </div>
    </motion.div>
  );
};

export default CancellationCard;