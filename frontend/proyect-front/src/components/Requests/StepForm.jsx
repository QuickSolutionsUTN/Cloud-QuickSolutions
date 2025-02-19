import React, { useEffect, useState, useContext } from 'react';
import { Form, InputGroup, Card, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faPerson } from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../../contexts/AuthContext.jsx';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import FormSummary from './StepsRequestForm/FormSummary.jsx';
import apiService from '../../services/axiosConfig.jsx';
import ApiDeliveryForm from './StepsRequestForm/ApiDelivery.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function StepForm({ step, formData, updateData, setIsStepComplete }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const serviceType = queryParams.get('type');
  const { register, getValues, handleSubmit, setValue, watch, formState: { isValid, errors } } = useForm({
    defaultValues: formData,
    mode: 'onChange'
  });
  const [maintenanceArray, setMaintenanceArray] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const { isAuthenticated, userEmail, userName, userSurName } = useContext(AuthContext);

  const categoryId = Number(watch('categoryId'));
  const productTypeId = Number(watch('productTypeId'));

  useEffect(() => {
    if (serviceType === 'repair') {
      setValue('serviceId', 1);
      handleChange({ ...getValues(), serviceId: 1 });
    } else if (serviceType === 'maintenance') {
      setValue('serviceId', 2);
      handleChange({ ...getValues(), serviceId: 2 });
      loadMaintenances();
      loadCategories();
      loadProducts();
    }
  }, [serviceType, setValue, getValues]);

  useEffect(() => {
    if (isAuthenticated && step.id === 2) {
      console.log("Usuario autenticado:", userEmail);
      handleChange({ ...watch(), userEmail: userEmail });
    }
  }, [isAuthenticated, userEmail, step, setValue]);

  useEffect(() => {
    console.log("useEffect ejecutado: isValid =", isValid);
    if (isValid) {
      console.log("Formulario es válido");
    }
    setIsStepComplete(isValid);
    if (isValid) {
      console.log("isStepComplete es true");
    }
  }, [isValid, setIsStepComplete, watch]);

  const handleChange = (data) => {
    updateData(data);
  };

  useEffect(() => {
    if (serviceType) {
      loadCategories();
    }
  }, [serviceType]);

  useEffect(() => {
    if (categoryId && serviceType === 'repair') {
      loadProductsByCatId(categoryId);
    }
  }, [categoryId, setValue]);


  const loadCategories = async () => {
    try {
      const response = await apiService.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Error al obtener las categorias:", error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await apiService.getProducts();
      setProductTypes(response.data);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  const loadMaintenances = async () => {
    try {
      const response = await apiService.getMaintenanceArray();
      console.log("Mantenimientos obtenidos:", response.data);
      setMaintenanceArray(response.data);
    } catch (error) {
      console.error("Error al obtener los mantenimientos:", error);
    }
  };

  const loadProductsByCatId = async (id) => {
    try {
      const response = await apiService.getProductByCatId(id);
      console.log("Productos obtenidos:", response.data);
      setProductTypes(response.data);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  const getCategoryByProductTypeId = (id) => {
    const productType = productTypes.find(type => type.id === id);
    return categories.find(category => category.id === productType.idCategoria);
  };

  const getProductNameById = (id) => {
    const productType = productTypes.find(type => type.id === id);
    return productType.descripcion;
  };

  const handleCardClick = async (maintenance) => {
    setValue('maintenanceTypeId', maintenance.id);
    setValue('productTypeId', maintenance.idTipoProducto);

    const category = getCategoryByProductTypeId(maintenance.idTipoProducto);
    setValue('categoryId', category.id);

    handleChange({ ...getValues(), maintenanceTypeId: maintenance.id, categoryId: category?.id, productTypeId: maintenance.idTipoProducto });
  };

  const filteredCategories = serviceType === 'maintenance' ? categories.filter(category =>
    maintenanceArray.some(maintenance => {
      const productType = productTypes.find(type => type.id === maintenance.idTipoProducto);
      return productType && productType.idCategoria === category.id;
    })
  ) : categories;

  const filteredProductTypes = serviceType === 'maintenance' ? productTypes.filter(productType =>
    maintenanceArray.some(maintenance => maintenance.idTipoProducto === productType.id)
  ) : productTypes;

  const filteredMaintenanceArray = maintenanceArray.filter(maintenance => {
    const productType = productTypes.find(type => type.id === maintenance.idTipoProducto);
    const categoryMatch = categoryId ? productType?.idCategoria === categoryId : true;
    const productMatch = productTypeId ? maintenance.idTipoProducto === productTypeId : true;

    return categoryMatch && productMatch;
  });

  const handleCategoryChange = (e) => {
    setValue('categoryId', e.target.value);
    if (serviceType === 'maintenance') setValue('maintenanceTypeId', '');
    setValue('productTypeId', '');
    handleChange({ ...getValues(), categoryId: e.target.value, maintenanceTypeId: '' });
  };

  const handleProductTypeChange = (e) => {
    setValue('productTypeId', e.target.value);
    if (serviceType === 'maintenance') setValue('maintenanceTypeId', '');
    handleChange({ ...getValues(), productTypeId: e.target.value, maintenanceTypeId: '' });
  };

  return (
    <Form className='formInputs'>
      {step.id === 1 && (
        <>
          <div className='row mb-3'>
            <div className='col-4'>
              <p><b>Categoria</b></p>
              <Form.Select
                aria-label="Seleccionar categoria"
                {...register('categoryId', { required: true })}
                disabled={!serviceType}
                onChange={handleCategoryChange}
              >
                <option value="">Seleccione una categoría</option>
                {filteredCategories.map(category => (
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
                onChange={handleProductTypeChange}
              >
                <option value="">Seleccione un tipo de producto</option>
                {filteredProductTypes.length > 0 ? (
                  filteredProductTypes.map(type => (
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
                  {...register('problemDescription', { required: serviceType === 'repair' })}
                  onChange={(e) => {
                    setValue('problemDescription', e.target.value);
                    handleChange({ ...watch(), problemDescription: e.target.value });
                  }}
                />
              </InputGroup>
              {errors.problemDescription && <span className="text-danger">Este campo es obligatorio</span>}
            </div>
          )}
          {serviceType === "maintenance" && (
            <div className='row mb-3'>
              <div className='col-12'>
                <p><b>Tipo de mantenimiento</b></p>
                <div className="row">
                  {filteredMaintenanceArray.map((maintenance) => (
                    <div key={maintenance.id} className="col-md-4">
                      <Card style={{
                        width: '18rem',
                        cursor: 'pointer',
                        border: watch('maintenanceTypeId') === maintenance.id ? '1px solid #007bff' : '',
                      }} className="card"
                        onClick={() => handleCardClick(maintenance)}
                      >
                        <Card.Body>
                          <Card.Title>{maintenance.nombre}</Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">{getProductNameById(maintenance.idTipoProducto)}</Card.Subtitle>
                          <Card.Text>{maintenance.descripcion}</Card.Text>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
                </div>
                {errors.IdTipoMantenimiento && <span className="text-danger">Debes seleccionar un tipo de mantenimiento</span>}
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
            <p>No has iniciado sesión. Por favor, inicia sesión para continuar</p>
          )}
        </div>
      )
      }
      {
        step.id === 4 && (
          <>
            <FormSummary formData={formData} />
            <div className='mb-3'>
              <p>Seleccione confirmar para enviar la solicitud del servicio.</p>
            </div>
          </>
        )
      }
    </Form >
  );
}