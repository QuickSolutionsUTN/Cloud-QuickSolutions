import { PrismaClient } from '@prisma/client';
import { Injectable } from '../dependencies/injectable.dependency';
import { type IVehiculoRepository } from '../../domain/repositories/vehiculo.interface';
import { type Vehiculo } from '../../domain/entities/vehiculo.entity';
import { VehiculoMapper } from '../mappers/vehiculo-prisma.mapper';

@Injectable()
export class VehiculoRepository implements IVehiculoRepository {
  constructor(
    private readonly prisma: PrismaClient
  ) {}

  async create(vehiculo: Vehiculo): Promise<void> {
    await this.prisma.vehiculos.create({
      data: {
        anio: vehiculo.getAnio(),
        color: vehiculo.getColor(),
        descripcion: vehiculo.getDescripcion(),
        patente: vehiculo.getPatente(),
        id_tipo_vehiculo: vehiculo.getTipoVehiculo().getId(),
        id_modelo: vehiculo.getModelo().getId(),
        id_conductor: vehiculo.getConductorId()
      }
    });
  }

  async update(vehiculo: Vehiculo): Promise<void> {
    await this.prisma.vehiculos.update({
      where: {
        id_vehiculo: vehiculo.getId()
      },
      data: {
        anio: vehiculo.getAnio(),
        color: vehiculo.getColor(),
        descripcion: vehiculo.getDescripcion(),
        patente: vehiculo.getPatente(),
        id_tipo_vehiculo: vehiculo.getTipoVehiculo().getId(),
        id_modelo: vehiculo.getModelo().getId(),
        id_conductor: vehiculo.getConductorId()
      }
    });
  }

  async delete(conductorId: string): Promise<void> {
    await this.prisma.vehiculos.delete({
      where: {
        id_conductor: conductorId
      }
    });
  }

  async getById(vehiculoId: number): Promise<Vehiculo | null> {
    const vehiculoPrisma = await this.prisma.vehiculos.findUnique({
      where: {
        id_vehiculo: vehiculoId
      },
      include: {
        tipos_vehiculos: true,
        modelos: {
          include: {
            marcas: true
          }
        }
      }
    });

    if (!vehiculoPrisma) return null;

    return VehiculoMapper.fromPrismaToEntity(vehiculoPrisma);
  }

  async getAll(): Promise<Vehiculo[]> {
    const vehiculosPrisma = await this.prisma.vehiculos.findMany({
      include: {
        tipos_vehiculos: true,
        modelos: {
          include: {
            marcas: true
          }
        }
      }
    });

    return VehiculoMapper.fromPrismaArrayToEntity(vehiculosPrisma);
  }

  async getByConductorId(conductorId: string): Promise<Vehiculo | null> {
    const vehiculoPrisma = await this.prisma.vehiculos.findFirst({
      where: {
        id_conductor: conductorId
      },
      include: {
        tipos_vehiculos: true,
        modelos: {
          include: {
            marcas: true
          }
        }
      }
    });

    if (!vehiculoPrisma) return null;

    return VehiculoMapper.fromPrismaToEntity(vehiculoPrisma);
  }

  async getByPatente(patente: string): Promise<Vehiculo | null> {
    const vehiculoPrisma = await this.prisma.vehiculos.findUnique({
      where: {
        patente
      },
      include: {
        tipos_vehiculos: true,
        modelos: {
          include: {
            marcas: true
          }
        }
      }
    });

    if (!vehiculoPrisma) return null;

    return VehiculoMapper.fromPrismaToEntity(vehiculoPrisma);
  }
}