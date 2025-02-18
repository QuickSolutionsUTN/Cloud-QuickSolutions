import { FichaMedica } from '../../domain/entities/fichaMedica.entity';
import { type fichas_medicas as fichaMedicaPrisma } from '@prisma/client';

export class FichaMedicaMapper {
  public static fromPrismaToEntity(fichaMedica: fichaMedicaPrisma): FichaMedica {
    const {
      altura,
      peso,
      enfermedad_cardiaca,
      enfermedad_respiratoria,
      alergias,
      epilepsia,
      diabetes,
      compartir,
      id_conductor
    } = fichaMedica;

    return new FichaMedica(
      altura,
      parseFloat(peso.toString()),
      enfermedad_cardiaca,
      enfermedad_respiratoria,
      alergias,
      epilepsia,
      diabetes,
      compartir,
      id_conductor
    );
  }

  public static fromPrismaArrayToEntity(fichasMedicas: fichaMedicaPrisma[]): FichaMedica[] {
    return fichasMedicas.map((fichaMedica) => this.fromPrismaToEntity(fichaMedica));
  }
}