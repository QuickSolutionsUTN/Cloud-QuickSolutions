import axios from 'axios';
import { type Envio } from '../../domain/entities/envio.entity';
import { GEOCODING_API_KEY } from '../../config/envs.config';
import { type Checkpoint } from '../../domain/entities/checkpoint.entity';

const API_KEY = GEOCODING_API_KEY;
const API_URL = 'https://api.opencagedata.com/geocode/v1/json';

interface CompleteAddress {
  calle: string
  numero: number
  localidad: string
  provincia: string
}

export const obtenerCoordenadas = async ({
  calle,
  numero,
  localidad,
  provincia
}: CompleteAddress): Promise<{ latitud: number, longitud: number } | null> => {
  // Rua Cafelândia, Carapicuíba, Brasil.
  // Rua+Cafel%C3%A2ndia%2C+Carapicu%C3%ADba%2C+Brasil
  const dirCompleta = `calle ${calle} ${numero}, ${localidad}, ${provincia}, Argentina`;
  const apiUrl1 = `${API_URL}?q=${dirCompleta}&key=${API_KEY}`;

  try {
    const response = await axios.get(apiUrl1);
    const results = response.data.results;

    if (results.length > 0) {
      const { lat, lng } = results[0].geometry;
      const latitud = lat;
      const longitud = lng;
      console.log(`Latitud: ${latitud}, Longitud: ${longitud}`);
      return { latitud, longitud };
    } else {
      console.log('No se encontraron coordenadas para la dirección.');
      return null;
    }
  } catch (error: any) {
    console.error('Error en pruebaCoordenadas:', error.response?.data || error.message);
    throw error;
  }
};

export async function obtenerCoordOrigen(envio: Envio): Promise<{ latitud: number, longitud: number } | null> {
  const calle = envio.getOrigen().getCalle();
  const numero = envio.getOrigen().getNumero();
  const localidad = envio.getOrigen().getLocalidad().getNombre();
  const provincia = envio.getOrigen().getLocalidad().getProvincia().getNombre();

  return await obtenerCoordenadas({ calle, numero, localidad, provincia });
};

export async function obtenerCoordDestino(envio: Envio): Promise<{ latitud: number, longitud: number } | null> {
  const calle = envio.getDestino().getCalle();
  const numero = envio.getDestino().getNumero();
  const localidad = envio.getDestino().getLocalidad().getNombre();
  const provincia = envio.getDestino().getLocalidad().getProvincia().getNombre();

  return await obtenerCoordenadas({ calle, numero, localidad, provincia });
};


// Uso la api para convertir las coordenadas de un checkpoint a direccion
// JSON format request for coordinates -22.6792, 14.5272.
// Ej: https://api.opencagedata.com/geocode/v1/json?q=-22.6792%2C+14.5272&key=YOUR-API-KEY&pretty=1

export const obtenerDireccion = async (checkpoint: Checkpoint): Promise<string | null> => {
  const latitud = checkpoint.getLatitud();
  const longitud = checkpoint.getLongitud();
  const checkpointAmbulancia = `${latitud}+${longitud}`;
  const apiUrl = `${API_URL}?q=${checkpointAmbulancia}&key=${API_KEY}`;

  try {
    const response = await axios.get(apiUrl);

    if (response.data.status.code === 200 && response.data.results.length > 0) {
      const components = response.data.results[0].components;
      const road = components.road || 'Desconocido';
      const houseNumber = components.house_number || 'N/A';
      const city = components.city || 'Desconocida';

      return `${road} ${houseNumber}, ${city}`;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al obtener la dirección:', error);
    return null;
  }
};
