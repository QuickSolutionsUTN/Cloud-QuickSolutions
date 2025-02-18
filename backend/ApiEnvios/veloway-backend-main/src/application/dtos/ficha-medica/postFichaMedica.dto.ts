import { postFichaMedicaValidation } from '../../validations/ficha-medica/postFichaMedica.validation';

export class PostFichaMedicaDto {
  private constructor(
    public altura: number,
    public peso: number,
    public enfermedadCardiaca: string | null,
    public enfermedadRespiratoria: string | null,
    public alergias: string | null,
    public epilepsia: boolean,
    public diabetes: boolean,
    public compartir: boolean,
    public idConductor: string
  ) {}

  public static create(fichaMedica: any): [string?, PostFichaMedicaDto?] {
    const fichaMedicaValidation = postFichaMedicaValidation(fichaMedica);

    if (!fichaMedicaValidation.success) {
      return [JSON.parse(fichaMedicaValidation.error.message)];
    }

    return [undefined, new PostFichaMedicaDto(
      fichaMedicaValidation.data.altura,
      fichaMedicaValidation.data.peso,
      fichaMedicaValidation.data.enfermedadCardiaca,
      fichaMedicaValidation.data.enfermedadRespiratoria,
      fichaMedicaValidation.data.alergias,
      fichaMedicaValidation.data.epilepsia,
      fichaMedicaValidation.data.diabetes,
      fichaMedicaValidation.data.compartir,
      fichaMedicaValidation.data.id_conductor
    )];
  }
}