import { type Provincia } from '../../../domain/entities/provincia.entity';

export class GetProvinciaDto {
  private constructor(
    public idProvincia: number,
    public nombre: string
  ) {}

  public static create(provincia: Provincia): GetProvinciaDto {
    return new GetProvinciaDto(
      provincia.getID(),
      provincia.getNombre()
    );
  }
}