import { type coordenadas as coordenadasPrisma } from '@prisma/client';
import { Coordenada } from '../../domain/entities/coordenada.entity';

export class CoordenadaPrismaMapper {
  public static fromPrismaToEntity(coordenada: coordenadasPrisma): Coordenada {
    const {
      id_coordenadas,
      latitud,
      longitud
    } = coordenada;

    return new Coordenada(
      id_coordenadas,
      latitud,
      longitud
    );
  }

  public static fromPrismaArrayToEntity(coordenadas: coordenadasPrisma[]): Coordenada[] {
    return coordenadas.map((coordenada) => this.fromPrismaToEntity(coordenada));
  }
}