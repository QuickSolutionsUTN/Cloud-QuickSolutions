import { Router } from 'express';
import { checkpointsController } from '../../infrastructure/dependencies/container.dependency';

export class CheckpointsRoutes {
  static get routes(): Router {
    const router = Router();

    router.post('/create', checkpointsController.create);
    router.get('/idCheckpoint/:idCheckpoint', checkpointsController.getCheckpoint);
    router.get('/checkpoint/idViaje/:idCheckpoint');

    return router;
  }
}