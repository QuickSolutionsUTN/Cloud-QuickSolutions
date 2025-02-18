import { PrismaClient } from '@prisma/client';
import { Injectable } from '../dependencies/injectable.dependency';
import { type IModeloRepository } from '../../domain/repositories/modelo.interface';
import { Modelo } from '../../domain/entities/modelo.entity';
import { Marca } from '../../domain/entities/marca.entity';

@Injectable()
export class ModeloRepository implements IModeloRepository {
  constructor(
    private readonly prisma: PrismaClient
  ) {}

  async create(modelo: Modelo): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async update(modelo: Modelo): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async delete(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async getById(id: number): Promise<Modelo | null> {
    const modeloPrisma = await this.prisma.modelos.findUnique({
      where: {
        id_modelo: id
      },
      include: {
        marcas: true
      }
    });

    if (!modeloPrisma) return null;

    return new Modelo(
      modeloPrisma.id_modelo,
      modeloPrisma.nombre,
      new Marca(
        modeloPrisma.marcas.id_marca,
        modeloPrisma.marcas.nombre
      )
    );
  }

  async getAll(): Promise<Modelo[]> {
    throw new Error('Method not implemented.');
  }

  async getAllByMarcaId(marcaId: number): Promise<Modelo[]> {
    const modelosPrisma = await this.prisma.modelos.findMany({
      where: {
        id_marca: marcaId
      },
      include: {
        marcas: true
      }
    });

    const modelos = modelosPrisma.map(modelo => new Modelo(
      modelo.id_modelo,
      modelo.nombre,
      new Marca(
        modelo.marcas.id_marca,
        modelo.marcas.nombre
      )
    ));

    return modelos;
  }
}