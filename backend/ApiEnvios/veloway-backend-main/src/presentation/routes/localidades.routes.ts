import { Router } from 'express';
import { localidadesController } from '../../infrastructure/dependencies/container.dependency';

export class LocalidadesRoutes {
  static get routes(): Router {
    const router = Router();

    router.get('/', localidadesController.getAll);

    return router;
  }
}