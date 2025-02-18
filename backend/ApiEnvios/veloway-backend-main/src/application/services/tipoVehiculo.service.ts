import { ITipoVehiculoRepository } from '../../domain/repositories/tipoVehiculo.interface';
import { Inject, Injectable } from '../../infrastructure/dependencies/injectable.dependency';
import { REPOSITORIES_TOKENS } from '../../infrastructure/dependencies/repositories-tokens.dependency';
import { CustomError } from '../errors/custom.errors';

@Injectable()
export class TipoVehiculoService {
  constructor(
    @Inject(REPOSITORIES_TOKENS.ITipoVehiculoRepository)
    private readonly tipoVehiculoRepository: ITipoVehiculoRepository
  ) {}

  async getAllTiposVehiculo(): Promise<any> {
    const tiposVehiculo = await this.tipoVehiculoRepository.getAll();

    if (tiposVehiculo.length === 0) throw CustomError.notFound('No se encontraron tipos de vehiculo');

    return tiposVehiculo;
  }
}