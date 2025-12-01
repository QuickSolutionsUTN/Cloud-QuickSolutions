// src/components/admin/request-steps/read-only/DiagnosisCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

const DiagnosisCard = ({ text }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="description-card h-100"
      style={{ borderLeft: '4px solid #17a2b8' }} 
    >
      <div className="row h-100 align-items-center">
        <div className="col-12">
          {text ? (
            <span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>
          ) : (
            <span className="text-muted fst-italic">Sin diagnóstico registrado.</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DiagnosisCard;