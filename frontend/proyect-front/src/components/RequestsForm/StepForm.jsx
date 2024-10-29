import React, { useEffect, useState, useContext } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // Importa axios
import { useBackendURL } from '../../contexts/BackendURLContext';
import AuthContext from '../../contexts/AuthContext.jsx';

//productData: {categoryId:'', productTypeId:'', problemDescription:''},

export default function StepForm({ step, formData, updateData }) {
  const backendURL = useBackendURL();
  const [categories, setCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const { isAuthenticated, userEmail } = useContext(AuthContext);
  const[email, setEmail] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      console.log("Usuario autenticado:", userEmail);
      setEmail(userEmail); // Load the user's email
    }
  }, [isAuthenticated, userEmail]);
  //console.log("product data", formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setFormData((prevState) => ({
        ...prevState,
        personalData: {
          ...prevState.personalData,
          email: value, // Update only the email field
        },
      }));
    } else {
    console.log("name", name, "value", value);
    updateData({ [name]: value });
    }

  };


  // Fetch categories and product types from the backend
  useEffect(() => {
    axios.get(`${backendURL}/categoria`)
      .then(response => {
        console.log(response.data);
        setCategories(response.data)
      })
      .catch(error => console.error("Error fetching categories:", error));
  }, []);

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;

    handleChange({ target: { name: 'categoryId', value: categoryId } });

    // API call to get product types based on the selected category
    axios.get(`${backendURL}/tipoproducto/${categoryId}`)
      .then(response => {
        console.log(response.data);
        setProductTypes(response.data);
      })
      .catch(error => console.error('Error loading product types:', error));
  }

  return (
    <div className='formInputs'>
      {step.id === 1 && (
        <>
          <div className='row mb-3'>
            <div className='col-4'>
              <p><b>Categoria</b></p>
              <Form.Select
                aria-label="Seleccionar categoria"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleCategoryChange}
              >
                <option value="">Seleccione una categoría</option>
                {categories.map(category => (
                  <option key={category.id}
                    name="category"
                    value={category.id}
                  >{category.descripcion}</option>
                ))}
              </Form.Select>
            </div>
            <div className='col-4'>
              <p><b>Tipo de producto</b></p>
              <Form.Select
                aria-label="Seleccionar tipo de producto"
                name="productTypeId"
                value={formData.productTypeId}
                onChange={handleChange}
              >
                <option value="">Seleccione un tipo de producto</option>
                {productTypes.length > 0 ? (
                  productTypes.map(type => (
                    <option key={type.id}
                      value={type.id}
                    >{type.descripcion}</option>
                  ))
                ) : (
                  <option value="">""</option>
                )}
              </Form.Select>
            </div>
          </div>
          <div className='row mb-3'>
            <InputGroup>
              <InputGroup.Text>Descripcion del problema</InputGroup.Text>
              <Form.Control
                as="textarea"
                aria-label="With textarea"
                name="problemDescription"
                value={formData.problemDescription}
                onChange={handleChange}
              />
            </InputGroup>
          </div>
        </>
      )}
      {step.id === 2 && (
        <div>
          {isAuthenticated ? (
            <>
              <Form.Label><b>Email</b></Form.Label>
              <Form.Control
                type='text'
                placeholder={email}
                aria-label='Email'
                name='email'
                value={email}
                onChange={handleChange}
                readOnly
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
                  ></Form.Control>
                </div>
                <div className='col-6'>
                  <Form.Label><b>Apellido</b></Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Prueba'
                    aria-label='Disabled input example'
                    readOnly
                  ></Form.Control>
                </div>

              </div>

            </>
          ) : (
            <h2>No has iniciado sesión. Por favor, inicia sesión.</h2>
          )}
        </div>
      )}
      {step.id === 3 && (
        <div>
          {/* Payment step content */}
          <p>Aquí va el formulario para la información de pago.</p>
        </div>
      )}
    </div>
  );
}