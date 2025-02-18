import { type Licencia } from '../../../domain/entities/licencia.entity';

export class GetLicenciaDto {
  private constructor(
    public categoria: string,
    public fechaVenc: string,
    public numero: number
  ) {}

  public static create(licencia: Licencia): GetLicenciaDto {
    return new GetLicenciaDto(
      licencia.getCategoria(),
      licencia.getFechaVenc().toLocaleDateString(),
      licencia.getNumero()
    );
  }
}
