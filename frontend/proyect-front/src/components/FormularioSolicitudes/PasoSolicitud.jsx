import React from 'react';
import { Form,InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function PasoFormulario({ paso }) {
    return (
        <div className='formInputs'>
            {paso.id === 1 && (
                <>
                    <div className='row mb-3'>
                        <div className='col-4'>
                            {/* Contenido del paso de selección de producto */}
                            <p><b>Categoria</b></p>
                            <Form.Select aria-label="Default select example">
                                <option>Open this select menu</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </Form.Select>
                        </div>
                        <div className='col-4'>
                            <p><b>Tipo de producto</b></p>
                            <Form.Select aria-label="Default select example">
                                <option>Open this select menu</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </Form.Select>
                        </div>
                    </div>
                    <div className='row mb-3'>
                        <InputGroup>
                            <InputGroup.Text>Descripcion del problema</InputGroup.Text>
                            <Form.Control as="textarea" aria-label="With textarea" />
                        </InputGroup>
                    </div>
                </>
            )}
            {paso.id === 2 && (
                <div>
                    <p><b>Tipo de producto</b></p>
                    <Form.Select aria-label="Default select example">
                        <option>Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </Form.Select>
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