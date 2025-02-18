import { Router } from 'express';
import { tipoVehiculoController } from '../../infrastructure/dependencies/container.dependency';

export class TipoVehiculoRoutes {
  static get routes(): Router {
    const router = Router();

    router.get('/', tipoVehiculoController.getAllTiposVehiculo);

    return router;
  }
}
