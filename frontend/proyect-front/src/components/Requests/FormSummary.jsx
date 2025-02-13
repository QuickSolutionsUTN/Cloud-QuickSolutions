import React from "react";

export default function FormSummary({ formData }) {
  console.log("Form data received in FormSummary", formData);
  return(
    <div>
      <h2>Resumen del Formulario</h2>
      <h3>Datos del Producto</h3>
      {/*
      <p>Servicio: {formData.productData.serviceId}</p>
      <p>Categoria: {formData.productData.categoryId}</p>
      <p>Tipo de Producto: {formData.productData.productTypeId}</p>
      <p>Descripcion del problema: {formData.productData.problemDescription}</p>
      <p>Con logistica: {formData.productData.conLogistica ? 'Si' : 'No'}</p>
      <h3>Datos Personales</h3>
      <p>Email: {formData.personalData.email}</p>
      <p>Nombre: {formData.personalData.firstName}</p>
      <p>Apellido: {formData.personalData.lastName}</p>*/}
    </div>
  );
};