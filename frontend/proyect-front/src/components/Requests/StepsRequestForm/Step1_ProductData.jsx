import React, { useEffect, useState } from 'react';
import { Form, InputGroup, Card } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import apiService from '../../../services/axiosConfig.jsx';

export default function StepProductData({ formData, control, errors, setValue }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [maintenanceArray, setMaintenanceArray] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const serviceType = queryParams.get('type');
  const categoryId = formData?.productData?.categoryId;
  const productTypeId = Number(formData?.productData?.productTypeId);

  useEffect(() => {
    loadCategories();
    loadProducts();
    console.log("Service type:", formData?.productData.serviceId);
    if (formData?.productData.serviceId === 2) loadMaintenances();
  }, [formData]);

  useEffect(() => {
    if (categoryId && serviceType === 'repair') {
      console.log('Cargando productos por categoria:', categoryId);
      loadProductsByCatId(categoryId);
    }
  }, [categoryId]);

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


  const getProductNameById = (id) => {
    const productType = productTypes.find(type => type.id === id);
    return productType.descripcion;
  };
  const getCategoryByProductTypeId = (id) => {
    const productType = productTypes.find(type => type.id === id);
    return categories.find(category => category.id === productType.idCategoria);
  };

  const handleCardClick = async (maintenance) => {
    setValue('productData.maintenanceTypeId', maintenance.id);
    setValue('productData.productTypeId', maintenance.idTipoProducto);

    const category = getCategoryByProductTypeId(maintenance.idTipoProducto);
    setValue('productData.categoryId', category.id);
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

  return (
    <>
      <div className='row mb-3'>
        <div className='col-4'>
          <p><b>Categoria</b></p>
          <Controller name="productData.categoryId" control={control} defaultValue={formData?.productData.categoryId || ''} render={({ field }) => (
            <Form.Select
              aria-label="Seleccionar categoria"
              value={formData?.productData.categoryId || ''}
              disabled={!serviceType}
              onChange={(e) => { field.onChange(e.target.value); }}
            >
              <option value="">Seleccione una categoría</option>
              {filteredCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.descripcion}
                </option>
              ))}
            </Form.Select>)} />
        </div>
        <div className='col-4'>
          <p><b>Tipo de producto</b></p>
          <Controller name="productData.productTypeId" control={control} defaultValue={formData?.productData.productTypeId || ''} render={({ field }) => (
            <Form.Select
              aria-label="Seleccionar tipo de producto"
              value={formData?.productData.productTypeId || ''}
              disabled={!categoryId}
              onChange={(e) => { field.onChange(e.target.value); }}
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
            </Form.Select>)} />
          {/*errors.productTypeId && <span className="text-danger">Este campo es obligatorio</span>*/}
        </div>
      </div>
      <div className='row mb-3'>
        {serviceType === "repair" && (
          <div className='row mb-3'>
            <Controller name="productData.problemDescription" control={control} defaultValue={formData?.productData.problemDescription || ''} render={({ field }) => (
              <InputGroup>
                <InputGroup.Text>Descripcion del problema</InputGroup.Text>
                <Form.Control
                  as="textarea"
                  aria-label="With textarea"
                  value={formData?.productData.problemDescription || ''}
                  onChange={(e) => { field.onChange(e.target.value); }}
                />
              </InputGroup>)} />
            {/*errors.problemDescription && <span className="text-danger">Este campo es obligatorio</span>*/}
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
                      border: formData?.productData.maintenanceTypeId === maintenance.id ? '1px solid #007bff' : '',
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
      </div>
    </>
  );
}