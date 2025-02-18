import { Router } from 'express';
import { licenciasController } from '../../infrastructure/dependencies/container.dependency'; // Por que se llama desde el container.dependency.ts?

export class LicenciasRoutes {
  static get routes(): Router {
    const router = Router();

    router.get('/', licenciasController.getAll);
    router.get('/:conductorID', licenciasController.getLicenciaByConductorId);
    router.get('/licencia/:licenciaID', licenciasController.getLicencia);
    router.post('/create', licenciasController.create);
    router.put('/update/:licenciaID', licenciasController.update);

    return router;
  }
}