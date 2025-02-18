import { PrismaClient } from '@prisma/client';
import { Usuario } from '../../domain/entities/usuario.entity';
import { Injectable } from '../dependencies/injectable.dependency';
import { type IUsuarioRepository } from '../../domain/repositories/usuario.interface';

@Injectable()
export class UsuarioRepository implements IUsuarioRepository {
  constructor(private readonly prisma: PrismaClient) { }

  // Método para obtener todos los usuarios
  public async getall(): Promise<Usuario[]> {
    const usuariosData = await this.prisma.usuarios.findMany();

    // Mapeamos los resultados de la base de datos a la entidad Usuario
    return usuariosData.map((usuarioData) => {
      return new Usuario(
        usuarioData.id_usuario,
        usuarioData.dni,
        usuarioData.email,
        usuarioData.password,
        usuarioData.fecha_nac,
        usuarioData.nombre,
        usuarioData.apellido,
        usuarioData.es_conductor,
        usuarioData.is_active,
        usuarioData.api_key,
        usuarioData.telefono
      );
    });
  }

  public async getUsuario(id: string): Promise<Usuario | null> {
    const usuarioData = await this.prisma.usuarios.findUnique({
      where: {
        id_usuario: id
      }
    });

    // Si encontramos al usuario, lo convertimos en una instancia de Usuario
    if (usuarioData) {
      return new Usuario(
        usuarioData.id_usuario,
        usuarioData.dni,
        usuarioData.email,
        usuarioData.password,
        usuarioData.fecha_nac,
        usuarioData.nombre,
        usuarioData.apellido,
        usuarioData.es_conductor,
        usuarioData.is_active,
        usuarioData.api_key,
        usuarioData.telefono
      );
    }

    // Si no existe, retornamos null
    return null;
  }

  public async getUsuarioByEmail(email: string): Promise<Usuario | null> {
    const usuarioData = await this.prisma.usuarios.findUnique({
      where: {
        email
      }
    });

    if (usuarioData) {
      return new Usuario(
        usuarioData.id_usuario,
        usuarioData.dni,
        usuarioData.email,
        usuarioData.password,
        usuarioData.fecha_nac,
        usuarioData.nombre,
        usuarioData.apellido,
        usuarioData.es_conductor,
        usuarioData.is_active,
        usuarioData.api_key,
        usuarioData.telefono
      );
    }
    return null;
  }

  public async create(usuario: Usuario): Promise<void> {
    await this.prisma.usuarios.create({
      data: {
        id_usuario: usuario.getID(),
        dni: usuario.getDni(),
        email: usuario.getEmail(),
        password: usuario.getPassword(),
        fecha_nac: usuario.getFechaNac(),
        nombre: usuario.getNombre(),
        apellido: usuario.getApellido(),
        es_conductor: usuario.getEsConductor(),
        api_key: usuario.getApiKey(),
        telefono: usuario.getTelefono()
      }
    });
  }

  public async update(id: string, user: any): Promise<void> {
    try {
      // Validamos que el objeto data no esté vacío
      await this.prisma.usuarios.update({
        where: {
          id_usuario: id
        },
        data: {
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido,
          telefono: user.telefono
        }
      });
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      throw new Error('No se pudo actualizar al usuario');
    }
  }

  public async resetPassword(newPassword: string, usuario: Usuario): Promise<void> {
    try {
      await this.prisma.usuarios.update({
        where: { id_usuario: usuario.getID() }, // Buscamos el usuario por su ID
        data: {
          password: newPassword // Guardamos la contraseña encriptada
        }
      });
    } catch (error) {
      console.error('Error al resetear contraseña del usuario:', error);
      throw new Error('No se pudo guardar la contraseña');
    }
  }

  public async deactivateUser(id: string): Promise<void> {
    try {
      await this.prisma.usuarios.update({
        where: { id_usuario: id },
        data: { is_active: false }
      });
    } catch (error) {
      console.error('Error al desactivar la cuenta del usuario:', error);
      throw new Error('No se pudo desactivar la cuenta del usuario.');
    }
  }

  public async updateApiKey(userId: string, hashedApiKey: string): Promise<void> {
    try {
      await this.prisma.usuarios.update({
        where: { id_usuario: userId },
        data: { api_key: hashedApiKey }
      });
    } catch (error) {
      throw new Error('Error al actualizar la API Key en la base de datos');
    }
  }

  async findUserByApiKey(apiKey: string): Promise<Usuario | null> {
  // Buscar el usuario en la base de datos por la API Key (suponiendo que la clave esté en la base de datos)
    const user = await this.prisma.usuarios.findUnique({ where: { api_key: apiKey } });

    if (user) {
      return new Usuario(
        user.id_usuario,
        user.dni,
        user.email,
        user.password,
        user.fecha_nac,
        user.nombre,
        user.apellido,
        user.es_conductor,
        user.is_active,
        user.api_key,
        user.telefono
      );
    }
    return null;
  }


  async buscarUsuarioPorDNI (dni: number): Promise<Usuario | null> {
    try {
      const usuarioData = await this.prisma.usuarios.findUnique({
        where: { dni }// Incluye domicilio si es necesario
      });
      if (usuarioData) {
        return new Usuario(
          usuarioData.id_usuario,
          usuarioData.dni,
          usuarioData.email,
          usuarioData.password,
          usuarioData.fecha_nac,
          usuarioData.nombre,
          usuarioData.apellido,
          usuarioData.es_conductor,
          usuarioData.is_active,
          usuarioData.api_key,
          usuarioData.telefono
        );
      }
      return null;
    } catch (error) {
      console.error('Error buscando usuario:', error);
      throw new Error('Error al buscar el usuario por DNI.');
    }
  };
}
