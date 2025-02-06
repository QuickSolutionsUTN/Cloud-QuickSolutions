import React from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import './AdminHeaderWithModal.css';

const AdminHeaderWithModal = ({ title, buttonText, showModal, handleClose, handleAdd, handleSave, children }) => {
  return (
    <>
      <div className='admin-header-component'>
        <h2>{title}</h2>
        <Button className="btn" variant="outline-primary" onClick={handleAdd}>
          {buttonText}
        </Button>
      </div >
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {children}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AdminHeaderWithModal;