import React, { useContext, useEffect, useState } from 'react';
import { Form, InputGroup, Card } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import apiService from '../../../services/axiosConfig.jsx';
import AuthContext from '../../../contexts/AuthContext.jsx'

export default function StepPersonalData({ formData, control, errors, setValue }) {

  const { isAuthenticated, userEmail, userName, userSurName } = useContext(AuthContext);
  
  useEffect(() => {
    if (isAuthenticated) {
      setValue('personalData.email', userEmail);
      setValue('personalData.firstName', userName);
      setValue('personalData.lastName', userSurName);
    }
  }, [isAuthenticated]);
  return (
    <div className='step2'>
      {isAuthenticated ? (
        <>
          <Form.Label><b>Email</b></Form.Label>
          <Form.Control
            type='text'
            placeholder={userEmail}
            aria-label='Email'
            readOnly
          ></Form.Control>
          <br />
          <div className='row mb-3'>
            <div className='col-6'>
              <Form.Label><b>Nombre</b></Form.Label>
              <Form.Control
                type='text'
                placeholder={userName}
                aria-label='Disabled input example'
                readOnly
              ></Form.Control>
            </div>
            <div className='col-6'>
              <Form.Label><b>Apellido</b></Form.Label>
              <Form.Control
                type='text'
                placeholder={userSurName}
                aria-label='Disabled input example'
                readOnly
              ></Form.Control>
            </div>
          </div>
        </>
      ) : (
        <div className='error'>No has iniciado sesión. Por favor, inicia sesión para continuar</div>
      )}
    </div>
  );
}
