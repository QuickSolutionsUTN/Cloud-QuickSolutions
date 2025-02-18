import { PrismaClient } from '@prisma/client';
import { Injectable } from '../dependencies/injectable.dependency';
import { type IMarcaRepository } from '../../domain/repositories/marca.interface';
import { Marca } from '../../domain/entities/marca.entity';

@Injectable()
export class MarcaRepository implements IMarcaRepository {
  constructor(
    private readonly prisma: PrismaClient
  ) {}

  async create(marca: Marca): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async update(marca: Marca): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async delete(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async getById(id: number): Promise<Marca | null> {
    throw new Error('Method not implemented.');
  }

  async getAll(): Promise<Marca[]> {
    const marcasPrisma = await this.prisma.marcas.findMany();

    const marcas = marcasPrisma.map(marca => new Marca(
      marca.id_marca,
      marca.nombre
    ));

    return marcas;
  }
}