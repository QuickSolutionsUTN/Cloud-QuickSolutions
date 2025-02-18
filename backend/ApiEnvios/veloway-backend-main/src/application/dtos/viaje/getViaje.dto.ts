import { type Coordenada } from '../../../domain/entities/coordenada.entity';
import { type Envio } from '../../../domain/entities/envio.entity';
import { type Viaje } from '../../../domain/entities/viaje.entity';

export class GetViajeDto {
  private constructor(
    public checkpointActual: number,
    public fechaFin: string,
    public fechaInicio: string,
    public idConductor: string,
    public envio: Envio,
    public origenCord: Coordenada,
    public destinoCord: Coordenada
  ) {}

  public static create(viaje: Viaje): GetViajeDto {
    const fechaFin = viaje.getFechaFin()?.toISOString().split('T')[0] || '';
    const fechaInicio = viaje.getFechaInicio()?.toISOString().split('T')[0] || '';

    return new GetViajeDto(
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