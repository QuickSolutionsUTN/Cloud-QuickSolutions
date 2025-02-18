import { type Coordenada } from '../../../domain/entities/coordenada.entity';
import { type Envio } from '../../../domain/entities/envio.entity';
import { type Viaje } from '../../../domain/entities/viaje.entity';

export class GetViajeActualDto {
  private constructor(
    public checkpointActual: number,
    public fechaFin: string,
    public fechaInicio: string,
    public idConductor: string,
    public envio: Envio,
    public origenCord: Coordenada,
    public destinoCord: Coordenada
  ) {}

  public static create(viaje: Viaje): GetViajeActualDto {
    const fechaFin = viaje.getFechaFin()?.toISOString() || '';
    const fechaInicio = viaje.getFechaInicio()?.toISOString() || '';

    return new GetViajeActualDto(
      viaje.getCheckpointActual(),
      fechaFin,
      fechaInicio,
      viaje.getIdConductor(),
      viaje.getEnvio(),
      viaje.getOrigenCord(),
      viaje.getDestinoCord()
    );
  }
}

// select: {
//     id_viaje: true,
//     fecha_inicio: true,
//     envios: {
//       select: {
//         nro_seguimiento: true,
//         descripcion: true,
//         fecha: true,
//         hora: true,
//         reserva: true,
//         estados_envio: {
//           select: {
//             nombre: true
//           }
//         }
//       }
//     }
//   }