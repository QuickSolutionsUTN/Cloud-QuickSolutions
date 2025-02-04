import React, { useEffect, useState, useContext } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useBackendURL } from '../../contexts/BackendURLContext';
import AuthContext from '../../contexts/AuthContext.jsx';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

export default function StepForm({ step, formData, updateData, setIsStepComplete }) {
  const backendURL = useBackendURL();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const serviceType = queryParams.get('type');
  const { register, handleSubmit, setValue, watch, formState: { isValid, errors } } = useForm({
    defaultValues: formData,
    mode: 'onChange'
  });
  const [categories, setCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const { isAuthenticated, userEmail } = useContext(AuthContext);
  const [email, setEmail] = useState('');

  const categoryId = watch('categoryId');

  useEffect(() => {
    if (isAuthenticated && step.id === 2) {
      console.log("Usuario autenticado:", userEmail);
      setEmail(userEmail);
      setValue('email', userEmail);
    }
  }, [isAuthenticated, userEmail, step, setValue]);

  const handleChange = (data) => {
    updateData(data);
  };

  useEffect(() => {
    if (serviceType) {
      axios.get(`${backendURL}/api/categoria`)
        .then(response => {
          console.log(response.data);
          setCategories(response.data);
        })
        .catch(error => console.error("Error fetching categories:", error));
    }
  }, [serviceType, backendURL]);

  useEffect(() => {
    if (categoryId) {
      axios.get(`${backendURL}/api/tipoproducto/${categoryId}`)
        .then(response => {
          console.log(response.data);
          setProductTypes(response.data);
        })
        .catch(error => console.error('Error loading product types:', error));
    }
  }, [categoryId, backendURL]);

  useEffect(() => {
    setIsStepComplete(isValid);
  }, [isValid, setIsStepComplete]);

  return (
    <Form onSubmit={handleSubmit(handleChange)} className='formInputs'>
      {step.id === 1 && (
        <>
          <div className='row mb-3'>
            <div className='col-4'>
              <p><b>Categoria</b></p>
              <Form.Select
                aria-label="Seleccionar categoria"
                {...register('categoryId', { required: true })}
                disabled={!serviceType}
                onChange={(e) => {
                  handleChange({ ...watch(), categoryId: e.target.value });
                }}
              >
                <option value="">Seleccione una categoría</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.descripcion}
                  </option>
                ))}
              </Form.Select>
              {errors.categoryId && <span className="text-danger">Este campo es obligatorio</span>}
            </div>
            <div className='col-4'>
              <p><b>Tipo de producto</b></p>
              <Form.Select
                aria-label="Seleccionar tipo de producto"
                {...register('productTypeId', { required: true })}
                disabled={!categoryId}
                onChange={(e) => {
                  handleChange({ ...watch(), productTypeId: e.target.value });
                }}
              >
                <option value="">Seleccione un tipo de producto</option>
                {productTypes.length > 0 ? (
                  productTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.descripcion}
                    </option>
                  ))
                ) : (
                  <option value="">""</option>
                )}
              </Form.Select>
              {errors.productTypeId && <span className="text-danger">Este campo es obligatorio</span>}
            </div>
          </div>
          {serviceType === "repair" && (
            <div className='row mb-3'>
              <InputGroup>
                <InputGroup.Text>Descripcion del problema</InputGroup.Text>
                <Form.Control
                  as="textarea"
                  aria-label="With textarea"
                  {...register('problemDescription', { required: true })}
                  onChange={(e) => {
                    handleChange({ ...watch(), problemDescription: e.target.value });
                  }}
                />
              </InputGroup>
              {errors.problemDescription && <span className="text-danger">Este campo es obligatorio</span>}
            </div>
          )}
          {serviceType === "maintenance" && (
            <div className='row mb-3'>
              <div className='col-4'>
                <p><b>Tipo de mantenimiento</b></p>
                <Form.Select
                  aria-label="Seleccionar tipo de mantenimiento"
                  {...register('maintenanceType', { required: false })}
                  onChange={(e) => {
                    handleChange({ ...watch(), maintenanceType: e.target.value });
                  }}
                >
                  <option value="">Seleccione un tipo de mantenimiento</option>
                </Form.Select>
                {errors.maintenanceType && <span className="text-danger">Este campo es obligatorio</span>}
              </div>
            </div>
          )}
        </>
      )}
      {step.id === 2 && (
        <div className='step2'>
          {isAuthenticated ? (
            <>
              <Form.Label><b>Email</b></Form.Label>
              <Form.Control
                type='text'
                placeholder={email}
                aria-label='Email'
                {...register('email')}
                readOnly
                onChange={(e) => handleChange(watch())}
              ></Form.Control>
              <br />
              <div className='row mb-3'>
                <div className='col-6'>
                  <Form.Label><b>Nombre</b></Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Usuario'
                    aria-label='Disabled input example'
                    readOnly
                    onChange={(e) => handleChange(watch())}
                  ></Form.Control>
                </div>
                <div className='col-6'>
                  <Form.Label><b>Apellido</b></Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Prueba'
                    aria-label='Disabled input example'
                    readOnly
                    onChange={(e) => handleChange(watch())}
                  ></Form.Control>
                </div>
              </div>
              <div className='row mb-3'>
                <div className='col-12'>
                  <button type="submit" className="btn btn-primary" disabled={!isValid}>
                    Siguiente
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p>No has iniciado sesión. Por favor, inicia sesión para continuar</p>
          )}
        </div>
      )}
      {step.id === 3 && (
        <div>
          <p>Seleccione confirmar para enviar la solicitud del servicio.</p>
          <div className='row mb-3'>
            <div className='col-12'>
              <button type="submit" className="btn btn-primary" disabled={!isValid}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </Form>
  );
}