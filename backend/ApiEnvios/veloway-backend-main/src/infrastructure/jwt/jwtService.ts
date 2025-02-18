import { SECRET_KEY_ACCESS_TOKEN, SECRET_KEY_REFRESH_TOKEN } from '../../config/envs.config';
import { type Usuario } from '../../domain/entities/usuario.entity';
import { Injectable } from '../dependencies/injectable.dependency';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string
  nombre: string
  apellido: string
  email: string
  esConductor: boolean
  activo: boolean
}

@Injectable()
export class JwtService {
  static readonly accessSecretKey = SECRET_KEY_ACCESS_TOKEN || '';
  static readonly expiresIn = '1h';
  static readonly refreshExpiresIn = '7d';
  static readonly refreshSecretKey = SECRET_KEY_REFRESH_TOKEN || '';

  public static generateAccessToken(usuario: Usuario): { accessToken: string, payload: JwtPayload } {
    const payload = {
      id: usuario.getID(),
      nombre: usuario.getNombre(),
      apellido: usuario.getApellido(),
      email: usuario.getEmail(),
      esConductor: usuario.getEsConductor(),
      activo: usuario.getIsActive()
    };
    // Generamos el token JWT con el payload
    const accessToken = jwt.sign(payload, this.accessSecretKey, { expiresIn: this.expiresIn, algorithm: 'HS256' });

    return { accessToken, payload };
  }

  public static generateRefreshToken(usuario: Usuario): string {
    const payload = {
      id: usuario.getID(),
      nombre: usuario.getNombre(),
      apellido: usuario.getApellido(),
      email: usuario.getEmail(),
      esConductor: usuario.getEsConductor(),
      activo: usuario.getIsActive()
    };
      // Generamos el token JWT con el payload
    const refreshToken = jwt.sign(payload, this.refreshSecretKey, { expiresIn: this.expiresIn, algorithm: 'HS256' });

    return refreshToken;
  }

  public static verifyAccessToken(token: string): any {
    try {
      return jwt.verify(token, this.accessSecretKey);// Verificamos si el token es válido
    } catch (error) {
      return null; // Si el token no es válido o ha expirado, devolvemos null
    }
  }

  public static verifyRefreshToken(refreshToken: string): any {
    try {
      return jwt.verify(refreshToken, this.refreshSecretKey);
    } catch (error) {
      return null;
    }
  }
}
