import { Router } from 'express';
import { usuariosController } from '../../infrastructure/dependencies/container.dependency';
import { authenticateUser } from '../middlewares/auth.middleware';

export class UsuarioRoutes {
  static get routes(): Router {
    const router = Router();

    router.get('/', usuariosController.getAll);
    router.get('/id/:id', usuariosController.getUsuarioPorId);
    router.get('/email/:email', usuariosController.getUsuarioPorEmail);
    router.post('/register', usuariosController.register);
    router.delete('/delete-account', authenticateUser, usuariosController.deleteAccount);
    router.post('/regenerate-api-key', authenticateUser, usuariosController.regenerateApiKey);
    router.put('/update-user', authenticateUser, usuariosController.modificarUsuario);
    router.put('/update-address', authenticateUser, usuariosController.modificarDomicilio);

    return router;
  }
};