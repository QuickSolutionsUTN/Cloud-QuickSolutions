import React from "react";
import { Accordion } from "react-bootstrap";
import { useEffect, useState } from "react";
import apiService from "../../../services/axiosConfig";
import envioService from "../../../services/apiEnviosService";
import { set } from "react-hook-form";

export default function FormSummary({ formData }) {
  const [services] = useState(
    [{ id: 1, name: 'Reparación' }, { id: 2, name: 'Mantenimiento' }]
  );
  const [categories, setCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [maintenanceArray, setMaintenanceArray] = useState(null);


  useEffect(() => {
    loadCategories();
    loadProducts();
    if (formData.logisticsData.conLogistica) handlegetLocalidades();
    if (formData.productData.serviceId === 2) loadMaintenances();
    console.log(formData);
  }, [formData]);

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
  const handlegetLocalidades = async () => {
    try {
      const response = await envioService.getLocalidades();
      setLocalidades(response);
    }
    catch (error) {
      console.error("❌ Error al obtener las localidades:", error);

    }
  }

  const loadMaintenances = async () => {
    try {
      const response = await apiService.getMaintenanceArray();
      setMaintenanceArray(response.data);
    }
    catch (error) {
      console.error("❌ Error al obtener las localidades:", error);

    }
  }
  const getServiceNameById = (id) => {
    const service = services.find(service => service.id === id);
    return service ? service.name : "Desconocido";
  };

  const getCategoryNameById = (id) => {
    const category = categories.find(category => category.id === id);
    return category ? category.descripcion : "Desconocido";
  };

  const getProductTypeNameById = (id) => {
    const productType = productTypes.find(type => type.id === id);
    return productType ? productType.descripcion : "Desconocido";
  };

  const getCityNameById = (id) => {
    const city = localidades.find(c => c.id === parseInt(id));
    return city ? city.nombre : "Desconocido";
  };

  const getStateName = (ciyId) => {
    const city = localidades.find(c => c.id === parseInt(ciyId));
    return city ? city.provincia.nombre : "Desconocido";
  };

  const getZipCode = (ciyId) => {
    const city = localidades.find(c => c.id === parseInt(ciyId));
    return city ? city.codigoPostal : "Desconocido";
  };

  const getMaintenanceDetails =  (id) => {
    if (maintenanceArray) {
      const maintenance = maintenanceArray.find(m => m.id === id);
      return maintenance ? maintenance.nombre + ' | ' + maintenance.descripcion : "Desconocido";
    }
    return "Desconocido";
  };



  const summaryData = [
    {
      title: "Datos del servicio",
      data: [
        { label: "Servicio", value: getServiceNameById(formData.productData.serviceId) },
        { label: "Categoría", value: getCategoryNameById(formData.productData.categoryId) },
        { label: "Tipo de Producto", value: getProductTypeNameById(formData.productData.productTypeId) },
      ], desc: formData.productData.problemDescription ? [
        { label: "Descripcion Del problema", value: formData.productData.problemDescription }]
        :
        [{ label: "Mantenimiento", value: getMaintenanceDetails(formData.productData.maintenanceTypeId) }]
    },
    {
      title: "Datos personales",
      data: [
        { label: "Email", value: formData.personalData.email },
        { label: "Nombre", value: formData.personalData.firstName },
        { label: "Apellido", value: formData.personalData.lastName }
      ]
    },
    {
      title: "Datos de envío",
      data: [
        { label: "Con logística", value: formData.logisticsData.conLogistica ? "Sí" : "No" }
      ],
      extraData: formData.logisticsData.conLogistica
        ? [
          { label: "Calle", value: formData.logisticsData.street },
          { label: "Número", value: formData.logisticsData.number },
          { label: "Piso", value: formData.logisticsData.floor },
          { label: "Departamento", value: formData.logisticsData.apartment },
          { label: "Ciudad", value: getCityNameById(formData.logisticsData.cityId) },
          { label: "Provincia", value: getStateName(formData.logisticsData.cityId) },
          { label: "Código Postal", value: getZipCode(formData.logisticsData.cityId) }
        ]
        : []
    }
  ];

  return (
    <div>
      {summaryData.map((section, index) => (
        <Accordion key={index} className="mb-2" defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <b>{section.title}</b>
            </Accordion.Header>
            <Accordion.Body>
              {section.data.map((item, i) => (
                <p key={i}>
                  <b>{item.label}:</b> {item.value}
                </p>
              ))}
              {section.desc?.map((item, i) => (
                <p key={`extra-${i}`}>
                  <b>{item.label}:</b> {item.value}
                </p>
              ))}
              {section.extraData?.map((item, i) => (
                <p key={`extra-${i}`}>
                  <b>{item.label}:</b> {item.value}
                </p>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      ))}
    </div>
  );
}