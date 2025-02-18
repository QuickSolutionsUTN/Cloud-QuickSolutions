import { updateClientValidation } from '../../validations/usuario/postUsuario.validation';

export class UpdateUsuarioDto {
  private constructor(
    public email: string,
    public nombre: string,
    public apellido: string,
    public telefono?: string | null
  ) {}

  public static update(usuario: any): UpdateUsuarioDto {
    const clienteValidation = updateClientValidation(usuario);

    if (clienteValidation.error) {
      return JSON.parse(clienteValidation.error.message);
    }


    return new UpdateUsuarioDto(
      clienteValidation.data.email,
      clienteValidation.data.name,
      clienteValidation.data.lastName,
      clienteValidation.data.phone
    );
  }
}