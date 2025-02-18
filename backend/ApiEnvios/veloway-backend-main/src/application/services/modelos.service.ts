import { type Modelo } from '../../domain/entities/modelo.entity';
import { IModeloRepository } from '../../domain/repositories/modelo.interface';
import { Inject, Injectable } from '../../infrastructure/dependencies/injectable.dependency';
import { REPOSITORIES_TOKENS } from '../../infrastructure/dependencies/repositories-tokens.dependency';
import { CustomError } from '../errors/custom.errors';

@Injectable()
export class ModelosService {
  constructor(
    @Inject(REPOSITORIES_TOKENS.IModeloRepository)
    private readonly modeloRepository: IModeloRepository
  ) {}

  async getAllByMarcaId(marcaId: number): Promise<Modelo[]> {
    const modelos = await this.modeloRepository.getAllByMarcaId(marcaId);
    if (modelos.length === 0) throw CustomError.notFound('No se encontraron modelos para la marca seleccionada');
    return modelos;
  }
}