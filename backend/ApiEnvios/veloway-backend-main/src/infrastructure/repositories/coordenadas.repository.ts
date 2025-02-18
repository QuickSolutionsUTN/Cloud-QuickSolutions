import { PrismaClient } from '@prisma/client';
import { type ICoordenadaRepository } from '../../domain/repositories/coordenadas.interface';
import { Injectable } from '../dependencies/injectable.dependency';
import { type Coordenada } from '../../domain/entities/coordenada.entity';
import { CoordenadaPrismaMapper } from '../mappers/coordenada-prisma.mapper';

@Injectable()
export class CoordenadasRepository implements ICoordenadaRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async create(coordenada: Coordenada): Promise<number> {
    const coordenadaData = await this.prisma.coordenadas.create({
      data: {
        latitud: coordenada.getLatitud(),
        longitud: coordenada.getLongitud()
      }
    });

    return Number(coordenadaData.id_coordenadas);
  }

  public async getAll(): Promise<Coordenada[]> {
    const coordenadasPrisma = await this.prisma.coordenadas.findMany();
    return CoordenadaPrismaMapper.fromPrismaArrayToEntity(coordenadasPrisma);
  }

  public async getCoordenadas(idCoordenadas: number): Promise<Coordenada | null> {
    const coordenadaPrisma = await this.prisma.coordenadas.findUnique({
      where: {
        id_coordenadas: idCoordenadas
      }
    });

    if (!coordenadaPrisma) {
      return null;
    }

    return CoordenadaPrismaMapper.fromPrismaToEntity(coordenadaPrisma);
  }

  public async delete(idCoordenada: number) {
    console.log(idCoordenada);

    await this.prisma.coordenadas.delete(
      {
        where: {
          id_coordenadas: idCoordenada
        }
      }
    );
  }
}