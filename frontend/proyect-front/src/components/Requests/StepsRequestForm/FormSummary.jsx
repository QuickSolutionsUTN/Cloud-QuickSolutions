import { Accordion } from "react-bootstrap";
import { useEffect, useState, useContext } from "react";
import AuthContext from "../../../contexts/AuthContext.jsx";
import apiService from "../../../services/axiosConfig";

export default function FormSummary({ formData }) {
  const [services] = useState(
    [{ id: 1, name: 'Reparación' }, { id: 2, name: 'Mantenimiento' }]
  );
  const [categories, setCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [maintenanceArray, setMaintenanceArray] = useState(null);
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
    loadProducts();
    if (formData.logisticsData.conLogistica) handlegetLocalidades();
    if (formData.productData.serviceId === 2) loadMaintenances();
    console.log(formData);
  }, [formData]);

  useEffect(() => {
      const fetchUserData = async () => {
        try {
          console.log('Obteniendo datos del usuario...', user.id);
          const response = await apiService.getUserProfile(user.id);
          console.log('Datos recibidos:', response.data);
          setUserData(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUserData();
    }, [ user, ]);

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

  const getMaintenanceDetails =  (id) => {
    if (maintenanceArray) {
      const maintenance = maintenanceArray.find(m => m.id === id);
      return maintenance ? maintenance.nombre + ' | ' + maintenance.descripcion : "Desconocido";
    }
    return "Desconocido";
  };

  const domicilio = userData.domicilio ?? null;

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
      title: "Datos de domicilio",
      data: [
        { label: "A domicilio", value: formData.logisticsData.conLogistica ? "Sí" : "No" }
      ],
      extraData: formData.logisticsData.conLogistica
        ? [
          { label: "Dirección", value: domicilio?.calle + " N° " + (domicilio?.numero || domicilio?.numero_calle) ?? "No especificado" },
          { label: "Piso", value: domicilio?.piso ?? "No especificado" },
          { label: "Departamento", value: domicilio?.departamento ?? "No especificado" },
          { label: "Provincia", value: domicilio?.provincia ?? "No especificado" },
          { label: "Localidad", value: domicilio?.localidad_nombre ?? "No especificado" },
          { label: "Código Postal", value: domicilio?.codigo_postal ?? "No especificado" }
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