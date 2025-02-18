import { PrismaClient } from '@prisma/client';
import { Injectable } from '../dependencies/injectable.dependency';
import { type ITipoVehiculoRepository } from '../../domain/repositories/tipoVehiculo.interface';
import { TipoVehiculo } from '../../domain/entities/tipoVehiculo.entity';

@Injectable()
export class TipoVehiculoRepository implements ITipoVehiculoRepository {
  constructor(
    private readonly prisma: PrismaClient
  ) {}

  async create(tipoVehiculo: TipoVehiculo): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async update(tipoVehiculo: TipoVehiculo): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async delete(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async getById(id: number): Promise<TipoVehiculo | null> {
    const tipoVehiculoPrisma = await this.prisma.tipos_vehiculos.findUnique({
      where: {
        id_tipo_vehiculo: id
      }
    });

    if (!tipoVehiculoPrisma) return null;

    return new TipoVehiculo(
      tipoVehiculoPrisma.id_tipo_vehiculo,
      tipoVehiculoPrisma.nombre
    );
  }

  async getAll(): Promise<TipoVehiculo[]> {
    const tiposVehiculoPrisma = await this.prisma.tipos_vehiculos.findMany();

    return tiposVehiculoPrisma.map(tipoVehiculoPrisma => new TipoVehiculo(
      tipoVehiculoPrisma.id_tipo_vehiculo,
      tipoVehiculoPrisma.nombre
    ));
  }
}