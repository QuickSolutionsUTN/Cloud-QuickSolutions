import { type Localidad } from '../../domain/entities/localidad.entity';
import { type ILocalidadRepository } from '../../domain/repositories/localidad.interface';
import { Inject, Injectable } from '../../infrastructure/dependencies/injectable.dependency';
import { REPOSITORIES_TOKENS } from '../../infrastructure/dependencies/repositories-tokens.dependency';
import { CustomError } from '../errors/custom.errors';

@Injectable()
export class LocalidadesService {
  constructor(@Inject(REPOSITORIES_TOKENS.ILocalidadesRepository) private readonly localidadesRepository: ILocalidadRepository) {}

  public async getAll(): Promise<Localidad[]> {
    const localidades = await this.localidadesRepository.getAll();
    if (localidades.length === 0) throw CustomError.notFound('No se encontraron localidades');
    return localidades;
  }
}