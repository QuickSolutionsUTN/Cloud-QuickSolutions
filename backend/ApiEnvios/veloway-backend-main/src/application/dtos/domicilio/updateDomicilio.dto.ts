import { postDomicilioValidation } from '../../validations/domicilio/postDomicilio.validation';

export class UpdateDomicilioDto {
  private constructor(
    public calle: string,
    public numero: number,
    public descripcion: string | null,
    public piso: number | null,
    public depto: string | null,
    public localidadID: number
  ) {}

  public static update(domicilio: any): UpdateDomicilioDto {
    const domicilioValidation = postDomicilioValidation(domicilio);

    if (domicilioValidation.error) {
      return JSON.parse(domicilioValidation.error.message);
    }


    return new UpdateDomicilioDto(
      domicilioValidation.data.calle,
      domicilioValidation.data.numero,
      domicilioValidation.data.descripcion,
      domicilioValidation.data.piso,
      domicilioValidation.data.depto,
      domicilioValidation.data.localidadID
    );
  }
}
