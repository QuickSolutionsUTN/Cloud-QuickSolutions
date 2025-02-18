import { postDomicilioValidation } from '../../validations/domicilio/postDomicilio.validation';

export class PostDomicilioDto {
  private constructor(
    public calle: string,
    public numero: number,
    public descripcion: string | null,
    public piso: number | null,
    public depto: string | null,
    public localidadID: number
  ) {}

  public static create(domicilio: any): [string?, PostDomicilioDto?] {
    const domicilioValidation = postDomicilioValidation(domicilio);

    if (domicilioValidation.error) {
      return [JSON.parse(domicilioValidation.error.message)];
    }

    return [undefined, new PostDomicilioDto(
      domicilioValidation.data.calle,
      domicilioValidation.data.numero,
      domicilioValidation.data.descripcion,
      domicilioValidation.data.piso,
      domicilioValidation.data.depto,
      domicilioValidation.data.localidadID
    )];
  }
}
