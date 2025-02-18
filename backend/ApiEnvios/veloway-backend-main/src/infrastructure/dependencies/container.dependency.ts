import 'reflect-metadata';
import { container } from 'tsyringe';
import { prismaClient } from '../data/prismaClient';
import { EnviosRepository } from '../repositories/envios.repository';
import { DomiciliosRepository } from '../repositories/domicilios.repository';
import { DomicilioService } from '../../application/services/domicilio.service';
import { LocalidadesRepository } from '../repositories/localidades.repository';
import { UsuarioRepository } from '../repositories/usuarios.repository';
import { UsuarioService } from '../../application/services/usuario.service';
import { UsuarioController } from '../../presentation/controllers/usuario.controller';
import { AuthController } from '../../presentation/auth/auth.controller';
import { AuthService } from '../../application/services/auth.service';
import { EnviosService } from '../../application/services/envios.service';
import { EnviosController } from '../../presentation/controllers/envios.controller';
import { PrismaClient } from '@prisma/client';
import { REPOSITORIES_TOKENS } from './repositories-tokens.dependency';
import { LicenciasRepository } from '../repositories/licencias.repository';
import { LicenciasService } from '../../application/services/licencias.service';
import { LicenciasController } from '../../presentation/controllers/licencias.controller';
import { FichasMedicaRepository } from '../repositories/fichasMedicas.repository';
import { FichasMedicasService } from '../../application/services/fichasMedicas.service';
import { FichasMedicasController } from '../../presentation/controllers/fichasMedicas.controller';
import { ViajesRepository } from '../repositories/viajes.repository';
import { ViajesService } from '../../application/services/viajes.service';
import { ViajesController } from '../../presentation/controllers/viajes.controller';
import { CoordenadasRepository } from '../repositories/coordenadas.repository';
import { LocalidadesService } from '../../application/services/localidades.service';
import { LocalidadesController } from '../../presentation/controllers/localidades.controller';
import { ConductoresRepository } from '../repositories/conductores.repository';
import { CheckpointsRepository } from '../repositories/checkpoints.repository';
import { CheckpointService } from '../../application/services/checkpoint.service';
import { CheckpointsController } from '../../presentation/controllers/checkpoints.controller';
import { ConductorService } from '../../application/services/conductor.service';
import { ConductorController } from '../../presentation/controllers/conductor.controller';
import { BcryptHashProvider } from '../jwt/bcrypt-hash.provider';
import { VehiculoRepository } from '../repositories/vehiculo.repository';
import { MarcaRepository } from '../repositories/marca.repository';
import { ModeloRepository } from '../repositories/modelo.repository';
import { TipoVehiculoRepository } from '../repositories/tipoVehiculo.repository';
import { VehiculoService } from '../../application/services/vehiculo.service';
import { VehiculoController } from '../../presentation/controllers/vehiculo.controller';
import { MarcasService } from '../../application/services/marcas.service';
import { ModelosService } from '../../application/services/modelos.service';
import { MarcaController } from '../../presentation/controllers/marca.controller';
import { ModeloController } from '../../presentation/controllers/modelo.controller';
import { TipoVehiculoService } from '../../application/services/tipoVehiculo.service';
import { TipoVehiculoController } from '../../presentation/controllers/tipoVehiculo.controller';
import { AuthOrApiKeyMiddlewareVerificator } from '../../presentation/middlewares/apiKey.middleware';

container.register(PrismaClient, { useValue: prismaClient });
// Repositorios
container.register(REPOSITORIES_TOKENS.IEnviosRepository, { useClass: EnviosRepository });
container.register(REPOSITORIES_TOKENS.IDomiciliosRepository, { useClass: DomiciliosRepository });
container.register(REPOSITORIES_TOKENS.ILocalidadesRepository, { useClass: LocalidadesRepository });
container.register(REPOSITORIES_TOKENS.ILicenciasRepository, { useClass: LicenciasRepository });
container.register(REPOSITORIES_TOKENS.IUsuariosRepository, { useClass: UsuarioRepository });
container.register(REPOSITORIES_TOKENS.IViajesRepository, { useClass: ViajesRepository });
container.register(REPOSITORIES_TOKENS.ICoordenadasRepository, { useClass: CoordenadasRepository });
container.register(REPOSITORIES_TOKENS.IConductoresRepository, { useClass: ConductoresRepository });
container.register(REPOSITORIES_TOKENS.ICheckpointsRepository, { useClass: CheckpointsRepository });
container.register(REPOSITORIES_TOKENS.IBcryptHashProvider, { useClass: BcryptHashProvider });
container.register(REPOSITORIES_TOKENS.IFichasMedicasRepository, { useClass: FichasMedicaRepository });
container.register(REPOSITORIES_TOKENS.IVehiculoRepository, { useClass: VehiculoRepository });
container.register(REPOSITORIES_TOKENS.IMarcaRepository, { useClass: MarcaRepository });
container.register(REPOSITORIES_TOKENS.IModeloRepository, { useClass: ModeloRepository });
container.register(REPOSITORIES_TOKENS.ITipoVehiculoRepository, { useClass: TipoVehiculoRepository });


// Servicios
container.register(EnviosService, { useClass: EnviosService });
container.register(ViajesService, { useClass: ViajesService });
container.register(LocalidadesService, { useClass: LocalidadesService });
container.register(UsuarioService, { useClass: UsuarioService });
container.register(AuthService, { useClass: AuthService });
container.register(CheckpointService, { useClass: CheckpointService });
container.register(DomicilioService, { useClass: DomicilioService });
container.register(ConductorService, { useClass: ConductorService });
container.register(LicenciasService, { useClass: LicenciasService });
container.register(FichasMedicasService, { useClass: FichasMedicasService });
container.register(VehiculoService, { useClass: VehiculoService });
container.register(MarcasService, { useClass: MarcasService });
container.register(ModelosService, { useClass: ModelosService });
container.register(TipoVehiculoService, { useClass: TipoVehiculoService });
container.register(AuthOrApiKeyMiddlewareVerificator, { useClass: AuthOrApiKeyMiddlewareVerificator });

// Controladores
container.register(EnviosController, { useClass: EnviosController });
export const enviosController = container.resolve(EnviosController);

container.register(ViajesController, { useClass: ViajesController });
export const viajesController = container.resolve(ViajesController);

container.register(LocalidadesController, { useClass: LocalidadesController });
export const localidadesController = container.resolve(LocalidadesController);

container.register(UsuarioController, { useClass: UsuarioController });
export const usuariosController = container.resolve(UsuarioController);

container.register(AuthController, { useClass: AuthController });
export const authController = container.resolve(AuthController);

container.register(CheckpointsController, { useClass: CheckpointsController });
export const checkpointsController = container.resolve(CheckpointsController);

container.register(ConductorController, { useClass: ConductorController });
export const conductorController = container.resolve(ConductorController);

container.register(LicenciasController, { useClass: LicenciasController });
export const licenciasController = container.resolve(LicenciasController);

container.register(FichasMedicasController, { useClass: FichasMedicasController });
export const fichaMedicaController = container.resolve(FichasMedicasController);

container.register(VehiculoController, { useClass: VehiculoController });
export const vehiculoController = container.resolve(VehiculoController);

container.register(MarcaController, { useClass: MarcaController });
export const marcaController = container.resolve(MarcaController);

container.register(ModeloController, { useClass: ModeloController });
export const modeloController = container.resolve(ModeloController);

container.register(TipoVehiculoController, { useClass: TipoVehiculoController });
export const tipoVehiculoController = container.resolve(TipoVehiculoController);


// Middleware
export const authOrApiKeyMiddlewareVerificator = container.resolve(AuthOrApiKeyMiddlewareVerificator);