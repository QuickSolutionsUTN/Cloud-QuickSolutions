import React from 'react';
import { useState } from 'react';

const SolicitudReparacion = ({ servicios }) => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [servicioSeleccionado, setServicioSeleccionado] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí puedes manejar la lógica para enviar la solicitud
        console.log({ nombre, email, servicioSeleccionado });
    };

    return (
        <div>
            <h1>Solicitud de Reparación</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Nombre:
                        <input 
                            type="text" 
                            value={nombre} 
                            onChange={(e) => setNombre(e.target.value)} 
                            required 
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Email:
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Servicio:
                        <select 
                            value={servicioSeleccionado} 
                            onChange={(e) => setServicioSeleccionado(e.target.value)} 
                            required
                        >
                            <option value="">Seleccione un servicio</option>
                            {servicios.map((servicio) => (
                                <option key={servicio.id} value={servicio.nombre}>
                                    {servicio.nombre}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <button type="submit">Enviar Solicitud</button>
            </form>
        </div>
    );
};

export async function getServerSideProps() {
    // Aquí puedes hacer una llamada a tu API para obtener la lista de servicios
    const res = await fetch('https://api.tuservicio.com/servicios'); // Cambia esta URL por tu API
    const servicios = await res.json();

    return {
        props: {
            servicios,
        },
    };
}

export default SolicitudReparacion;