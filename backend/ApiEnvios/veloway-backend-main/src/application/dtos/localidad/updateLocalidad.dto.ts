import { type UpdateProvinciaDto } from '../provincia/updateProvincia.dto';

export class UpdateLocalidadDto {
  private constructor(
    public nombre?: string,
    public provincia?: UpdateProvinciaDto
  ) {}
}