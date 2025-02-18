import { type Marca } from '../../domain/entities/marca.entity';
import { IMarcaRepository } from '../../domain/repositories/marca.interface';
import { Inject, Injectable } from '../../infrastructure/dependencies/injectable.dependency';
import { REPOSITORIES_TOKENS } from '../../infrastructure/dependencies/repositories-tokens.dependency';
import { CustomError } from '../errors/custom.errors';

@Injectable()
export class MarcasService {
  constructor(
    @Inject(REPOSITORIES_TOKENS.IMarcaRepository)
    private readonly marcaRepository: IMarcaRepository
  ) {}

  async getAllMarcas(): Promise<Marca[]> {
    const marcas = await this.marcaRepository.getAll();

    if (marcas.length === 0) throw CustomError.notFound('No se encontraron marcas');

    return marcas;
  }
}