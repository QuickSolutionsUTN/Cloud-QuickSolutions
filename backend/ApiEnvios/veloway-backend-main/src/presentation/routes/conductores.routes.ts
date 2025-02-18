import { Router } from 'express';
import { conductorController } from '../../infrastructure/dependencies/container.dependency';

export class ConductoresRoutes {
  static get routes(): Router {
    const router = Router();

    router.post('/register', conductorController.register);
    router.get('/idConductor/:idConductor', conductorController.getConductor);

    return router;
  }
};