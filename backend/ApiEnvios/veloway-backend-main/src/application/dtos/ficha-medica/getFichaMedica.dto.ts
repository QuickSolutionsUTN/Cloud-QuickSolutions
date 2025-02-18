import { type FichaMedica } from '../../../domain/entities/fichaMedica.entity';

export class GetFichaMedicaDto {
  private constructor(
    public altura: number,
    public peso: number,
    public enfermedadCardiaca: string | null,
    public enfermedadRespiratoria: string | null,
    public alergias: string | null,
    public epilepsia: boolean,
    public diabetes: boolean
  ) {}

  public static create(fichaMedica: FichaMedica): GetFichaMedicaDto {
    return new GetFichaMedicaDto(
      fichaMedica.getAltura(),
      fichaMedica.getPeso(),
      fichaMedica.getEnfermedadCardiaca(),
      fichaMedica.getEnfermedadRespiratoria(),
      fichaMedica.getAlergias(),
      fichaMedica.getEpilepsia(),
      fichaMedica.getDiabetes()
    );
  }
}