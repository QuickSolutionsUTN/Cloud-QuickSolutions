import { type Viaje } from '../../../domain/entities/viaje.entity';
import { GetEnvioDto } from '../envio/getEnvio.dto';

export class GetAllByConductorIdDto {
  private constructor(
    public idViaje: number,
    public idConductor: string,
    public envio: GetEnvioDto,
    public fechaFin?: string | null,
    public fechaInicio?: string | null
  ) {}

  public static create(viaje: Viaje): GetAllByConductorIdDto {
    const fechaFin = viaje.getFechaFin()?.toISOString().split('T')[0];
    const fechaInicio = viaje.getFechaInicio()?.toISOString().split('T')[0];

    return new GetAllByConductorIdDto(
      viaje.getIdViaje(),
      viaje.getIdConductor(),
      GetEnvioDto.create(viaje.getEnvio()),
      fechaFin,
      fechaInicio
    );
  }
}