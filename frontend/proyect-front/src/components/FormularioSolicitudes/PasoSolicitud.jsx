import React, { useEffect, useState, useContext } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // Importa axios
import { useBackendURL } from '../../BackendURLContext';
import AuthContext from '../../contexts/AuthContext.jsx';

//datosProducto: {idcategoria:'', idtipoproducto:'', descripcionProblema:''},

export default function PasoFormulario({ paso, formData, actualizarDatos }) {
  const backendURL = useBackendURL();
  const [categorias, setCategorias] = useState([]);
  const [tiposProducto, setTiposProducto] = useState([]);
  const { isAuthenticated, userEmail } = useContext(AuthContext);
  const[email, setEmail] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      console.log("Usuario autenticado:", userEmail);
      setEmail(userEmail); // Cargar el email del usuario
    }
  }, [isAuthenticated, userEmail]);
  //console.log("datos del producto", formData);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setFormData((prevState) => ({
        ...prevState,
        datosPersonales: {
          ...prevState.datosPersonales,
          email: value, // Actualiza solo el campo de email
        },
      }));
    } else {
    console.log("name", name, "value", value);
    actualizarDatos({ [name]: value });
    }

  };


  // Obtener categorías y tipos de producto desde el backend
  useEffect(() => {
    axios.get(`${backendURL}/categoria`)
      .then(response => {
        console.log(response.data);
        setCategorias(response.data)
      })
      .catch(error => console.error("Error fetching categories:", error));
  }, []);

  const handleCategoriaChange = (event) => {
    const categoriaId = event.target.value;

    manejarCambio({ target: { name: 'idcategoria', value: categoriaId } });

    // Llamada a la API para obtener los tipos de producto en función de la categoría seleccionada
    axios.get(`${backendURL}/tipoproducto/${categoriaId}`)
      .then(response => {
        console.log(response.data);
        setTiposProducto(response.data);
      })
      .catch(error => console.error('Error al cargar tipos de producto:', error));
  }

  return (
    <div className='formInputs'>
      {paso.id === 1 && (
        <>
          <div className='row mb-3'>
            <div className='col-4'>
              <p><b>Categoria</b></p>
              <Form.Select
                aria-label="Seleccionar categoria"
                name="idcategoria"
                value={formData.idcategoria}
                onChange={handleCategoriaChange}
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map(categoria => (
                  <option key={categoria.id}
                    name="categoria"
                    value={categoria.id}
                  >{categoria.descripcion}</option>
                ))}
              </Form.Select>
            </div>
            <div className='col-4'>
              <p><b>Tipo de producto</b></p>
              <Form.Select
                aria-label="Seleccionar tipo de producto"
                name="idtipoproducto"
                value={formData.idtipoproducto}
                onChange={manejarCambio}
              >
                <option value="">Seleccione un tipo de producto</option>
                {tiposProducto.length > 0 ? (
                  tiposProducto.map(tipo => (
                    <option key={tipo.id}
                      value={tipo.id}
                    >{tipo.descripcion}</option>
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
                name="descripcionProblema"
                value={formData.descripcionProblema}
                onChange={manejarCambio}
              />
            </InputGroup>
          </div>
        </>
      )}
      {paso.id === 2 && (
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
                onChange={manejarCambio}
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
      {paso.id === 3 && (
        <div>
          {/* Contenido del paso de pago */}
          <p>Aquí va el formulario para la información de pago.</p>
        </div>
      )}
    </div>
  );
}