import { Checkpoint } from '../../domain/entities/checkpoint.entity';
import { Coordenada } from '../../domain/entities/coordenada.entity';
import { type Viaje } from '../../domain/entities/viaje.entity';
import { ICheckpointsRepository } from '../../domain/repositories/checkpoint.interface';
import { ICoordenadaRepository } from '../../domain/repositories/coordenadas.interface';
import { Inject, Injectable } from '../../infrastructure/dependencies/injectable.dependency';
import { REPOSITORIES_TOKENS } from '../../infrastructure/dependencies/repositories-tokens.dependency';
import { type PostCheckpointDto } from '../dtos/checkpoint/postCheckpoint.dto';
import { CustomError } from '../errors/custom.errors';

@Injectable()
export class CheckpointService {
  constructor(
    @Inject(REPOSITORIES_TOKENS.ICheckpointsRepository) private readonly checkpointRepository: ICheckpointsRepository,
    @Inject(REPOSITORIES_TOKENS.ICoordenadasRepository) private readonly coordenadaRepository: ICoordenadaRepository
  ) {}

  public async create(checkpointDto: PostCheckpointDto): Promise<number> {
    const coordenada = new Coordenada(
      0,
      checkpointDto.latitud,
      checkpointDto.longitud
    );

    const idCoordenada = await this.coordenadaRepository.create(coordenada);

    const newCheckpoint = new Checkpoint(
      checkpointDto.numero,
      checkpointDto.idViaje,
      idCoordenada,
      checkpointDto.latitud,
      checkpointDto.longitud
    );

    return await this.checkpointRepository.create(newCheckpoint);
  }

  public async getCheckpoint(idCheckpoint: number): Promise<Checkpoint | null> {
    console.log('Buscando checkpoint con ese id');

    const checkpoint = await this.checkpointRepository.getCheckpoint(idCheckpoint);

    if (!checkpoint) throw CustomError.notFound('No se encontro un checkpoint con ese id');
    return checkpoint;
  }

  public async getCurrentCheckpointByIdViaje(viaje: Viaje): Promise<Checkpoint | null> {
    console.log('Buscando checkpoint actual');

    const currentCheckpoint = await this.checkpointRepository.getCurrentCheckpointByIdViaje(viaje);
    if (!currentCheckpoint) throw CustomError.notFound('No se encontro el checkpoint');
    return currentCheckpoint;
  }
}


