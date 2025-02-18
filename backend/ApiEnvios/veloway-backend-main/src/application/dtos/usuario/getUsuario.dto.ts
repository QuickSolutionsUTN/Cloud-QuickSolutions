import { type Usuario } from '../../../domain/entities/usuario.entity';

export class GetUsuarioDto {
  private constructor(
    private dni: number,
    private email: string,
    private fechaNac: Date,
    private nombre: string,
    private apellido: string,
    private esConductor: boolean,
    private apiKey: string,
    private telefono?: string | null

  ) {}

  public static create(usuario: Usuario): GetUsuarioDto {
    return new GetUsuarioDto(
      usuario.getDni(),
      usuario.getEmail(),
      usuario.getFechaNac(),
      usuario.getNombre(),
      usuario.getApellido(),
      usuario.getEsConductor(),
      usuario.getApiKey(),
      usuario.getTelefono()
    );
  }
}