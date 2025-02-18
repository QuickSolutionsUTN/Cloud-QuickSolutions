import { type Checkpoint } from '../entities/checkpoint.entity';
import { type Viaje } from '../entities/viaje.entity';

export interface ICheckpointsRepository {
  create: (checkpoint: Checkpoint) => Promise<number>
  getCheckpoint: (idCheckpoint: number) => Promise<Checkpoint | null>
  deleteCheckpointByViajeId: (idViaje: number) => Promise<string>
  getCurrentCheckpointByIdViaje: (viaje: Viaje) => Promise<Checkpoint | null>
}