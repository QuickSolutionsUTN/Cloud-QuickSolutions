import { Usuario } from '../../domain/entities/usuario.entity';
import { Injectable, Inject } from '../../infrastructure/dependencies/injectable.dependency';
import { randomUUID } from 'crypto';
import { REPOSITORIES_TOKENS } from '../../infrastructure/dependencies/repositories-tokens.dependency';
import { type RegisterUsuarioDto } from '../dtos/usuario/registerUsuario.dto';
import { generateApiKey } from '../../utils/generateApiKey';
import { IUsuarioRepository } from '../../domain/repositories/usuario.interface';
import { IBcryptHashProvider } from '../../domain/repositories/bcryptHashProvider.interface';

@Injectable()
export class UsuarioService {
  resetTokens: Map<string, string>;
  constructor(
    // @Inject(REPOSITORIES_TOKENS.IViajesRepository) private readonly viajeRepository: IViajeRepository,
    @Inject(REPOSITORIES_TOKENS.IUsuariosRepository) private readonly usuarioRepository: IUsuarioRepository,
    @Inject(REPOSITORIES_TOKENS.IBcryptHashProvider) private readonly hashProvider: IBcryptHashProvider
  ) {
    this.resetTokens = new Map<string, string>();
  }


  public async register(data: RegisterUsuarioDto): Promise<Usuario> {
    const { dni, email, password, fechaNac, nombre, apellido, esConductor, telefono } = data;


    const id = randomUUID(); // Generar UUID en el servicio
    const apiKey = generateApiKey();
    const hashedApiKey = await this.hashProvider.hash(apiKey);

    const usuarioExisteDni = await this.usuarioRepository.buscarUsuarioPorDNI(dni);
    const usuarioExistente = await this.usuarioRepository.getUsuarioByEmail(email);
    if (usuarioExistente) {
      throw new Error('El correo ya está registrado.');
    }
    if (usuarioExisteDni) {
      throw new Error('Esta persona ya tiene cuenta.');
    }

    // Encriptar la contraseña
    const hashedPassword = await this.hashProvider.hash(password);

    const fechaNacDate = new Date(fechaNac);

    // Crear la entidad de usuario
    const usuario = new Usuario(
      id,
      dni,
      email,
      hashedPassword,
      fechaNacDate,
      nombre,
      apellido,
      esConductor,
      true,
      hashedApiKey,
      telefono);

    // Guardar el usuario en la base de datos
    await this.usuarioRepository.create(usuario);

    return usuario;
  }

  public async getAll(): Promise<Usuario[]> {
    const usuarios = await this.usuarioRepository.getall();
    return usuarios;
  }


  public async getUsuarioPorId(id: string): Promise<any | null> {
    const usuario = await this.usuarioRepository.getUsuario(id);

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    return usuario;
  }

  public async getUsuarioPorEmail(email: string): Promise<any | null> {
    const usuario = await this.usuarioRepository.getUsuarioByEmail(email);

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    return usuario;
  }

  public async deactivateAccount(userId: string): Promise<void> {
    try {
      // Lógica adicional: verifica si el usuario ya está inactivo (opcional)
      const usuario = await this.usuarioRepository.getUsuario(userId);

      if (!usuario) {
        throw new Error('Usuario no encontrado.');
      }

      if (!usuario.getIsActive()) { // al pedo?
        throw new Error('La cuenta ya está desactivada.');
      }

      // Llamada al repositorio para desactivar la cuenta
      await this.usuarioRepository.deactivateUser(userId);
    } catch (error) {
      console.error('Error en el servicio de desactivación:', error);
      throw new Error('Error al desactivar la cuenta.');
    }
  }


  regenerateApiKeyService = async (userId: string) => {
    // Generamos una nueva API Key aleatoria
    const newApiKey = generateApiKey();

    // Hasheamos la nueva API Key para almacenarla de manera segura
    const hashedApiKey = await this.hashProvider.hash(newApiKey);

    // Actualizamos la base de datos con la nueva API Key hasheada
    await this.usuarioRepository.updateApiKey(userId, hashedApiKey);

    // Devolvemos la nueva API Key para mostrarla al usuario (solo una vez)
    return newApiKey;
  };


  async existUserByApiKey(apiKey: string): Promise<boolean> {
    // Buscar al usuario por la API Key proporcionada (comparable con el hash)
    const hashedApiKey = await this.hashProvider.hash(apiKey);
    const user = await this.usuarioRepository.findUserByApiKey(hashedApiKey);
    if (!user) return false;
    return true;
  }

  public async modificarUsuario(id: string, data: any): Promise<void> {
    try {
      // Verificamos si el usuario existe
      const usuarioExistente = await this.usuarioRepository.getUsuario(id);

      if (!usuarioExistente) {
        throw new Error('Usuario no encontrado');
      }

      // Si el usuario existe, procedemos con la actualización
      await this.usuarioRepository.update(id, data);
    } catch (error) {
      console.error('Error en el servicio al modificar usuario:', error);
      throw new Error('No se pudo modificar el usuario');
    }
  }
}

