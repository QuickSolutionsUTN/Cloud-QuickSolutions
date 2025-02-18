import { postLicenciaValidation } from '../../validations/licencia/postLicencia.validation';

export class PostLicenciaDto {
  private constructor(
    public categoria: string,
    public fechaVenc: Date,
    public numero: number,
    public idConductor: string
  ) {}

  public static create(licencia: any): [string?, PostLicenciaDto?] {
    const licenciaValidation = postLicenciaValidation(licencia);

    if (!licenciaValidation.success) {
      return [JSON.parse(licenciaValidation.error.message)];
    }

    // Convierte la fecha en formato Date para poder guardarla en la base de datos
    const fechaVenc = new Date(licenciaValidation.data.fechavencimiento);



    return [undefined, new PostLicenciaDto(
      licenciaValidation.data.categoria,
      fechaVenc,
      licenciaValidation.data.numero,
      licenciaValidation.data.id_conductor
    )];
  }
}