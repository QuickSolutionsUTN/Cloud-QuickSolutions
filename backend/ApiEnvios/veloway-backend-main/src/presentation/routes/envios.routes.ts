import { Router } from 'express';
import { authOrApiKeyMiddlewareVerificator, enviosController } from '../../infrastructure/dependencies/container.dependency';

export class EnviosRoutes {
  static get routes(): Router {
    const router = Router();

    router.get('/', enviosController.getAll);
    router.get('/cliente/:clienteID', enviosController.getAllByClienteId);
    router.get('/nro-seguimiento/:nroSeguimiento', enviosController.getEnvio);
    router.post('/create', authOrApiKeyMiddlewareVerificator.verify, enviosController.create);
    router.put('/update/nro-seguimiento/:nroSeguimiento', enviosController.update);
    router.patch('/update-estado/nro-seguimiento/:nroSeguimiento', enviosController.updateEstadoEnvio);
    router.patch('/cancelar/nro-seguimiento/:nroSeguimiento', enviosController.cancelarEnvio);
    return router;
  }
}