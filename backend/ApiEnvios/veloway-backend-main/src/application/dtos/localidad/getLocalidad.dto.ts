import { type Localidad } from '../../../domain/entities/localidad.entity';
import { GetProvinciaDto } from '../provincia/getProvincia.dto';

export class GetLocalidadDto {
  private constructor(
    public idLocalidad: number,
    public nombre: string,
    public codigoPostal: number,
    public provincia: GetProvinciaDto
  ) {};

  public static create(localidad: Localidad): GetLocalidadDto {
    return new GetLocalidadDto(
      localidad.getID(),
      localidad.getNombre(),
      localidad.getCodigoPostal(),
      GetProvinciaDto.create(localidad.getProvincia())
    );
  }
}

