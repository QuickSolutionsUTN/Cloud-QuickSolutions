import { type Coordenada } from '../../../domain/entities/coordenada.entity';

export class GetCoordendasDto {
  private constructor (
    public idCoordenadas: number,
    public latitud: number,
    public longitud: number
  ) {}

  public static create(coordenadas: Coordenada): GetCoordendasDto {
    return new GetCoordendasDto(
      coordenadas.getIdCoordenadas(),
      coordenadas.getLatitud(),
      coordenadas.getLongitud()
    );
  }
}