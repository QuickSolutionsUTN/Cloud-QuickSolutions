import { type Checkpoint } from '../../../domain/entities/checkpoint.entity';

export class GetCurrentCheckpointDto {
  private constructor(
    public numero: number,
    public idViaje: number,
    public idCoordenadas: number,
    public latitud: number,
    public longitud: number
  ) {}

  public static create(checkpoint: Checkpoint): GetCurrentCheckpointDto {
    return new GetCurrentCheckpointDto(
      checkpoint.getNumero(),
      checkpoint.getIdViaje(),
      checkpoint.getIdCoordenadas(),
      checkpoint.getLatitud(),
      checkpoint.getLongitud()
    );
  }
}