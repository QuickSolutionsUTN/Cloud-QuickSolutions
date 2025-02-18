import { type Request, type Response } from 'express';
import { AuthService } from '../../application/services/auth.service';
import { HandleError } from '../errors/handle.error';
import { Injectable } from '../../infrastructure/dependencies/injectable.dependency';
import { NODE_ENV } from '../../config/envs.config';
import { JwtService } from '../../infrastructure/jwt/jwtService';

@Injectable()
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Verificar las credenciales
      const loginResponse = await this.authService.login(email, password);

      if (!loginResponse) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      const { accessToken, refreshToken, payload } = loginResponse;

      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: String(NODE_ENV).trim() === 'production',
        sameSite: String(NODE_ENV).trim() === 'production' ? 'none' : 'strict',
        maxAge: 60 * 60 * 1000 // 1 hs
      });

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: String(NODE_ENV).trim() === 'production',
        sameSite: String(NODE_ENV).trim() === 'production' ? 'none' : 'strict',
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 30 días
      });
      // Enviar respuesta con el token
      res.status(200).json({ message: 'Login exitoso', user: payload });
    } catch (error) {
      return HandleError.throw(error, res);
    }
  };

  refreshAccessToken = async (req: Request, res: Response) => {
    const { refresh_token } = req.cookies;
    if (!refresh_token) {
      res.status(401).json({ message: 'No autorizado' });
      return;
    }
    const decoded = JwtService.verifyRefreshToken(refresh_token); // Obtenemos el payload del token
    if (!decoded) {
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
      res.status(401).json({ message: 'No autorizado' });
      return;
    }

    try {
      const { newAccessToken, newRefreshToken, payload } = await this.authService.refreshAccessToken(decoded.email);

      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: String(NODE_ENV).trim() === 'production',
        sameSite: String(NODE_ENV).trim() === 'production' ? 'none' : 'strict',
        maxAge: 60 * 60 * 1000 // 1 hs
      });

      // rotacion de refresh token
      res.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: String(NODE_ENV).trim() === 'production',
        sameSite: String(NODE_ENV).trim() === 'production' ? 'none' : 'strict',
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 30 días
      });

      res.status(200).json({ message: 'Sesión extendida', user: payload });
    } catch (error) {
      HandleError.throw(error, res);
    }
  };

  logout = (req: Request, res: Response): void => {
    try {
      // Verificar si la cookie 'auth_token' existe
      const authToken = req.cookies.auth_token;

      if (!authToken) {
        // Si no existe la cookie, enviar un mensaje de error
        res.status(400).json({ message: 'No hay sesión activa' });
        return;
      }

      // Si la cookie existe, limpiar la cookie
      res.clearCookie('auth_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
      });

      // Responder con éxito
      res.status(200).json({ message: 'Logout exitoso' });
    } catch (error) {
      // Manejar cualquier error durante el proceso
      res.status(500).json({ message: 'Hubo un error al cerrar sesión' });
    }
  };

  requestPasswordReset = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      await this.authService.requestPasswordReset(email);
      res.status(200).json({ message: 'Correo de recuperación enviado.' });
    } catch (error) {
      HandleError.throw(error, res);
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { code, newPassword } = req.body;
      await this.authService.resetPassword(code, newPassword);
      res.status(200).json({ message: 'Contraseña restablecida correctamente.' });
    } catch (error) {
      HandleError.throw(error, res);
    }
  };

  loginVerification = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: 'No autorizado' });
    } else {
      res.status(200).json({ message: 'Token válido', user });
    }
  };
}