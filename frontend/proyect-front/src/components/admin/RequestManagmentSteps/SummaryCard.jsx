import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck } from '@fortawesome/free-solid-svg-icons';

const SummaryCard = ({ text }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="description-card h-100"
      style={{ borderLeft: '4px solid #6f42c1' }} 
    >
      <div className="d-flex flex-column h-100">
        
        <div className="d-flex align-items-center mb-3 pb-2 border-bottom" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
            <div className="icon-wrapper me-2 d-flex align-items-center justify-content-center" 
                 style={{ width: '32px', height: '32px', background: '#f3e5f5', borderRadius: '6px' }}>
              <FontAwesomeIcon icon={faClipboardCheck} style={{ color: '#6f42c1' }} />
            </div>
            <span className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>Informe de Trabajo Realizado</span>
        </div>

        <div className="flex-grow-1">
          {text ? (
            <span style={{ whiteSpace: 'pre-wrap', color: '#495057' }}>{text}</span>
          ) : (
            <span className="text-muted fst-italic">No se ha registrado un resumen del trabajo final.</span>
          )}
        </div>

        <div className="mt-3 text-end">
            <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                Cierre técnico oficial
            </small>
        </div>

      </div>
    </motion.div>
  );
};

export default SummaryCard;