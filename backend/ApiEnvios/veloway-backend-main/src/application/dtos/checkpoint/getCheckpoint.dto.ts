import { type Checkpoint } from '../../../domain/entities/checkpoint.entity';

export class GetCheckpointDto {
  private constructor(
    public numero: number,
    public idViaje: number,
    public idCoordenadas: number,
    public latitud: number,
    public longitud: number
  ) {}

  public static create(checkpoint: Checkpoint): GetCheckpointDto {
    return new GetCheckpointDto(
      checkpoint.getNumero(),
      checkpoint.getIdViaje(),
      checkpoint.getIdCoordenadas(),
      checkpoint.getLatitud(),
      checkpoint.getLongitud()
    );
  }
}



