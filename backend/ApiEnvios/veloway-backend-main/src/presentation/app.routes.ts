import { Router } from 'express';
import { EnviosRoutes } from './routes/envios.routes';
import { LicenciasRoutes } from './routes/licencias.routes';
import { ViajesRoutes } from './routes/viajes.routes';
import { LocalidadesRoutes } from './routes/localidades.routes';
import { UsuarioRoutes } from './routes/usuario.routes';
import { AuthRoutes } from './routes/auth.routes';
import { CheckpointsRoutes } from './routes/checkpoints.routes';
import { ConductoresRoutes } from './routes/conductores.routes';
import { FichasMedicasRoutes } from './routes/fichasMedicas.routes';
import { VehiculoRoutes } from './routes/vehiculo.routes';
import { MarcasRoutes } from './routes/marcas.routes';
import { ModelosRoutes } from './routes/modelos.routes';
import { TipoVehiculoRoutes } from './routes/tipoVehiculo.routes';


export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use('/api/auth', AuthRoutes.routes);
    router.use('/api/envios', EnviosRoutes.routes);

    router.use('/api/viajes', ViajesRoutes.routes);
    router.use('/api/localidades', LocalidadesRoutes.routes);
    router.use('/api/usuarios', UsuarioRoutes.routes);
    router.use('/api/checkpoints', CheckpointsRoutes.routes);
    router.use('/api/conductores', ConductoresRoutes.routes);
    router.use('/api/licencias', LicenciasRoutes.routes);
    router.use('/api/fichasMedicas', FichasMedicasRoutes.routes);
    router.use('/api/vehiculos', VehiculoRoutes.routes);
    router.use('/api/marcas', MarcasRoutes.routes);
    router.use('/api/modelos', ModelosRoutes.routes);
    router.use('/api/tipos-vehiculo', TipoVehiculoRoutes.routes);

    return router;
  }
}