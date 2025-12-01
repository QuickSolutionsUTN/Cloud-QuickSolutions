import React, { useContext, useEffect, useState } from 'react';
import { Form, InputGroup, Card } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
import { useLocation, Link } from 'react-router-dom';
import apiService from '../../../services/axiosConfig.jsx';
import AuthContext from '../../../contexts/AuthContext.jsx'

export default function StepPersonalData({ formData, control, errors, setValue }) {
  /*
   const { isAuthenticated, user } = useContext(AuthContext);
 
   useEffect(() => {
     if (isAuthenticated) {
       setValue('personalData.email', user.email);
       setValue('personalData.firstName', user.nombre);
       setValue('personalData.lastName', userSurName);
     }
   }, [isAuthenticated]);*/
  const { isAuthenticated, user } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated && user) {
      setValue('personalData.email', user.email);
      setValue('personalData.firstName', user.nombre);
      setValue('personalData.lastName', user.apellido);
    }
  }, [isAuthenticated, user]);
  return (
    <div className='step2'>
      {isAuthenticated ? (
        <>
          <Form.Label><b>Email</b></Form.Label>
          <Controller
            name="personalData.email"
            control={control}
            defaultValue={user?.email || ''}
            render={({ field }) => (
              <Form.Control
                {...field}
                type='text'
                    value={formData?.personalData?.email || ''}
                    onChange={(e) => field.onChange(e.target.value)}
                    readOnly
                aria-label='Email'
              />
            )}
          />
          <br />
          <div className='row mb-3'>
            <div className='col-6'>
              <Form.Label><b>Nombre</b></Form.Label>

              <Controller
                name="personalData.firstName"
                control={control}
                defaultValue={user?.nombre || ''}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    type='text'
                    value={formData?.personalData?.firstName || ''}
                    onChange={(e) => field.onChange(e.target.value)}
                    readOnly
                    aria-label='Nombre'
                  />
                )}
              />
            </div>
            <div className='col-6'>
              <Form.Label><b>Apellido</b></Form.Label>
              <Controller
                name="personalData.lastName"
                control={control}
                defaultValue={user?.apellido || ''}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    type='text'
                    value={formData?.personalData?.lastName || ''}
                    onChange={(e) => field.onChange(e.target.value)}
                    readOnly
                    aria-label='Apellido'
                  />
                )}
              />
            </div>
          </div>
          <p className="text-muted mt-2">
            Si deseas modificar tus datos de usuario, dirígete a{' '}
            <Link to="/users/profile" className="fw-bold">Perfil</Link>.
          </p>
        </>
      ) : (
        <div className='error'>No has iniciado sesión. Por favor, inicia sesión para continuar</div>
      )}
    </div>
  );
}
