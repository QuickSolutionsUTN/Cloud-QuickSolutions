import { Router } from 'express';
import { vehiculoController } from '../../infrastructure/dependencies/container.dependency';

export class VehiculoRoutes {
  static get routes(): Router {
    const router = Router();

    router.get('/', vehiculoController.getAll);
    router.get('/vehiculoId/:vehiculoId', vehiculoController.getById);
    router.get('/conductorId/:conductorId', vehiculoController.getByConductorId);
    router.get('/patente/:patente', vehiculoController.getByPatente);
    router.post('/create', vehiculoController.create);
    router.put('/update', vehiculoController.update);
    router.delete('/delete/conductorId/:conductorId', vehiculoController.delete);

    return router;
  }
}