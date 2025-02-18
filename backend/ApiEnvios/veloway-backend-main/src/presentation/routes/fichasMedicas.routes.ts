import { Router } from "express";
import { fichaMedicaController } from "../../infrastructure/dependencies/container.dependency";

export class FichasMedicasRoutes{
    static get routes(): Router {
        const router = Router();

        router.get('/', fichaMedicaController.getAll);
        router.get('/:conductorID', fichaMedicaController.getFichaMedicaByConductorId);
        router.get('/fichaMedica/:fichaMedicaID', fichaMedicaController.getFichaMedica);
        router.post('/create', fichaMedicaController.create);
        router.put('/update/:fichaMedicaID', fichaMedicaController.update);

        return router;
    }
}