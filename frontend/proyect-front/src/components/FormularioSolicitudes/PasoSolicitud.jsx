import React from 'react';

export default function PasoFormulario({ paso }) {
    return (
        <div>
            <h3>{paso.nombre}</h3>
            {paso.id === 1 && (
                <div>
                    {/* Contenido del paso de selección de producto */}
                    <p>Aquí va el formulario para seleccionar un producto.</p>
                </div>
            )}
            {paso.id === 2 && (
                <div>
                    {/* Contenido del paso de envío */}
                    <p>Aquí va el formulario para la información de envío.</p>
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