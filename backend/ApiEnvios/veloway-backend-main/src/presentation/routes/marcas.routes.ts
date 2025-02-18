import { Router } from 'express';
import { marcaController } from '../../infrastructure/dependencies/container.dependency';

export class MarcasRoutes {
  static get routes(): Router {
    const router = Router();

    router.get('/', marcaController.getAllMarcas);

    return router;
  }
}