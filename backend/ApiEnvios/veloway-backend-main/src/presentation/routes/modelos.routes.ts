import { Router } from 'express';
import { modeloController } from '../../infrastructure/dependencies/container.dependency';

export class ModelosRoutes {
  static get routes(): Router {
    const router = Router();

    router.get('/marcaId/:marcaId', modeloController.getAllByMarcaId);

    return router;
  }
}