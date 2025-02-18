import { PrismaClient } from '@prisma/client';
import { Localidad } from '../../domain/entities/localidad.entity';
import { Provincia } from '../../domain/entities/provincia.entity';
import { type ILocalidadRepository } from '../../domain/repositories/localidad.interface';
import { Injectable } from '../dependencies/injectable.dependency';

@Injectable()
export class LocalidadesRepository implements ILocalidadRepository {
  constructor(private readonly prisma: PrismaClient) {}

  getAllByProvincia: (provinciaID: number) => Promise<Localidad[]>;
  create: (localidad: Localidad) => Promise<void>;
  update: (id: string, localidad: Localidad) => Promise<void>;
  delete: (id: string) => Promise<void>;


  public async getAll(): Promise<Localidad[]> {
    const localidadesData = await this.prisma.localidades.findMany({
      include: {
        provincias: true
      }
    });

    const localidades = localidadesData.map(localidadData => {
      return new Localidad(
        localidadData.id_localidad,
        localidadData.codigo_postal,
        localidadData.nombre,
        new Provincia(
          localidadData.provincias.id_provincia,
          localidadData.provincias.nombre
        )
      );
    });

    return localidades;
  }

  public async getLocalidad(localidadID: number): Promise<Localidad | null> {
    const localidadData = await this.prisma.localidades.findFirst({
      where: {
        id_localidad: localidadID
      },
      include: {
        provincias: true
      }
    });

    if (!localidadData) {
      return null;
    }

    const localidadEntity = new Localidad(
      localidadData.id_localidad,
      localidadData.codigo_postal,
      localidadData.nombre,
      new Provincia(
        localidadData.provincias.id_provincia,
        localidadData.provincias.nombre
      )
    );

    return localidadEntity;
  }
}