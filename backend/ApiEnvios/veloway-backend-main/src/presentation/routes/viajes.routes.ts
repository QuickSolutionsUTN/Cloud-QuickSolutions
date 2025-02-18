import { Router } from 'express';
import { viajesController } from '../../infrastructure/dependencies/container.dependency';

export class ViajesRoutes {
  static get routes(): Router {
    const router = Router();

    router.get('/all/conductor/:idConductor', viajesController.getAllByConductorId);
    router.get('/idViaje/:idViaje', viajesController.getViaje);
    router.get('/idConductor/:idConductor', viajesController.getViajeActual);
    router.post('/solicitarAmbulancia/:idViaje', viajesController.solicitarAmbulancia);
    router.patch('/update-checkpoint/idViaje/:idViaje', viajesController.updateCheckpointActual);

    return router;
  }
};