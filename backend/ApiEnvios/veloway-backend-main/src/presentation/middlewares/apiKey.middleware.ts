import { type Request, type Response, type NextFunction } from 'express';
import { UsuarioService } from '../../application/services/usuario.service';
import { Injectable } from '../../infrastructure/dependencies/injectable.dependency';
import { JwtService } from '../../infrastructure/jwt/jwtService';

// Middleware para verificar que la API Key está presente en los headers
@Injectable()
export class AuthOrApiKeyMiddlewareVerificator {
  constructor(private readonly usuarioService: UsuarioService) { }

  verify = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies.access_token; // hacer que agarre el token desde la cookie

    if (!token) {
      // Verificar si la API Key está presente en los headers
      const apiKey = req.headers.authorization?.split(' ')[1];
      if (!apiKey) {
        res.status(401).json({ message: 'No estás autenticado. API Key no proporcionada.' });
        return;
      }

      const existUserApiKey = await this.usuarioService.existUserByApiKey(apiKey);

      if (!existUserApiKey) {
        res.status(401).json({ message: 'API Key inválida.' });
        return;
      }

      next();
      return;
    }

    try {
      const decoded = JwtService.verifyAccessToken(token);
      req.user = decoded; // Establecemos el usuario decodificado en la solicitud
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token inválido o expirado.' });
    }
  };
}
