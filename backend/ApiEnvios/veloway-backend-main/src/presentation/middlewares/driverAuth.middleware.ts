// driverAuth.js
import { JwtService } from '../../infrastructure/jwt/jwtService';
import { type Request, type Response, type NextFunction } from 'express';

const jwtService = new JwtService();

const driverAuth = (req: Request, res: Response, next: NextFunction) => {
  // Se espera que el middleware de cookies (por ejemplo, cookie-parser) ya esté configurado en la app.
  const token = req.cookies.access_token; // El token se encuentra en las cookies con el nombre "accesstoken"

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado: Token requerido.' });
  }

  try {
    // Verificamos el token utilizando la clave secreta
    const decoded = jwtService.verifyToken(token);

    // Verificamos que el usuario sea conductor (esConductor debe ser true)
    if (!decoded.esConductor) {
      return res.status(403).json({ message: 'Acceso denegado: Solo conductores pueden acceder a esta ruta.' });
    }

    // Guardamos la información del usuario en req.user para que esté disponible en la ruta protegida
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido.' });
  }
};

module.exports = driverAuth;
