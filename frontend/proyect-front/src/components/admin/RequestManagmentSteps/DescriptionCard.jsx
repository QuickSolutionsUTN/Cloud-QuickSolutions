import React from 'react';
import { motion } from 'framer-motion';

const DescriptionCard = ({ text }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="description-card h-100"
    >
      <div className="row h-100">
        <div className="col-md-12 mb-3 mb-md-0 position-relative">
          {text ? (
            <span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>
          ) : (
            <span className="text-muted fst-italic">Sin descripción proporcionada.</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DescriptionCard;