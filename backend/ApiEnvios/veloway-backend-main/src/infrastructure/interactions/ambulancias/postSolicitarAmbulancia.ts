import axios from 'axios';
import { type Checkpoint } from '../../../domain/entities/checkpoint.entity';
import { type Conductor } from '../../../domain/entities/conductor.entity';
import { obtenerDireccion } from '../../geocodingAPI/geocodingApi';

const URL_AMBULANCIA = 'https://ambulanciaya.onrender.com/ambulancias/solicitar';

export async function postSolicitarAmbulancia(conductor: Conductor, checkpoint: Checkpoint): Promise<void> {
  const direccionRecuperada = await obtenerDireccion(checkpoint);

  const solicitudAmbulancia = {
    nombre: `${conductor.getNombre()} ${conductor.getApellido()}`,
    telefono: `${conductor.getTelefono()}`,
    direccion: `${direccionRecuperada}`,
    descripcion: 'Veloway'
  };

  await axios.post(URL_AMBULANCIA, solicitudAmbulancia);
}