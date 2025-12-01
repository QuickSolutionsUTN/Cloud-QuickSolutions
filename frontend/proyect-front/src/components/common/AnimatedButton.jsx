import React from 'react';
import { motion } from 'framer-motion';
import { Button } from 'react-bootstrap';

const AnimatedButton = ({ children, onClick, variant = "primary", type = "button", className, ...props }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.12, ease: "easeOut" }}
      style={{ width: 'fit-content' }}
    >
      <Button 
        variant={variant} 
        onClick={onClick} 
        type={type} 
        className={className}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
};

export default AnimatedButton;