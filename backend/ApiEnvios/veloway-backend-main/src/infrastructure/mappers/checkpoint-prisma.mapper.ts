import { type checkpoints as checkpointsPrisma } from '@prisma/client';
import { Checkpoint } from '../../domain/entities/checkpoint.entity';

export class CheckpointPrismaMapper {
  public static fromPrismaToEntity(checkpoint: checkpointsPrisma & { coordenadas: { id_coordenadas: number, latitud: number, longitud: number } }): Checkpoint {
    const {
      numero,
      id_viaje,
      id_checkpoint,
      coordenadas: {
        latitud,
        longitud
      }
    } = checkpoint;

    return new Checkpoint(
      numero,
      id_viaje,
      id_checkpoint,
      latitud,
      longitud
    );
  }

  public static fromPrismaArrayToEntity(
    checkpoints: Array<checkpointsPrisma & { coordenadas: { id_coordenadas: number, latitud: number, longitud: number } }>
  ): Checkpoint[] {
    return checkpoints.map((checkpoint) => this.fromPrismaToEntity(checkpoint));
  }
}