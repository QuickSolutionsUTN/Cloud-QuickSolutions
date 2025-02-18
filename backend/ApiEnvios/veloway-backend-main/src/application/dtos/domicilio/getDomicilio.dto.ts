import { type Domicilio } from '../../../domain/entities/domicilio.entity';
import { type Localidad } from '../../../domain/entities/localidad.entity';

export class GetDomicilioDto {
  private constructor(
    private calle: string,
    private numero: number,
    private localidad: Localidad,
    private piso?: number | null,
    private depto?: string | null,
    private descripcion?: string | null

  ) {}

  public static create(domicilio: Domicilio): GetDomicilioDto {
    return new GetDomicilioDto(
      domicilio.getCalle(),
      domicilio.getNumero(),
      domicilio.getLocalidad(),
      domicilio.getPiso(),
      domicilio.getDepto(),
      domicilio.getDescripcion()
    );
  }
}