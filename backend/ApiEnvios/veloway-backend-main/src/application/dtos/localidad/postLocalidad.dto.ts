import { type PostProvinciaDto } from '../provincia/postProvincia.dto';

export class PostLocalidadDto {
  private constructor(
    public codigoPostal: number,
    public nombre: string,
    public provincia: PostProvinciaDto
  ) {}
}