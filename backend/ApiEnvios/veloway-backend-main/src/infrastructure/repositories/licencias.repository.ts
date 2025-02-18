import { PrismaClient } from '@prisma/client';
import { type ILicenciaRepository } from '../../domain/repositories/licencia.interface';
import { Licencia } from '../../domain/entities/licencia.entity';
import { LicenciaPrismaMapper } from '../mappers/licencia-prisma.mapper';
import { Injectable } from '../dependencies/injectable.dependency';

@Injectable()
export class LicenciasRepository implements ILicenciaRepository {
  constructor (private readonly prisma: PrismaClient) {}

  public async getAll(): Promise<Licencia[]> {
    const licenciasPrisma = await this.prisma.licencias.findMany();
    return LicenciaPrismaMapper.fromPrismaArrayToEntity(licenciasPrisma);
  };

  public async getLicencia(licenciaID: number): Promise<Licencia | null> {
    const licenciaPrisma = await this.prisma.licencias.findUnique({
      where: {
        numero: licenciaID
      }
    });

    if (!licenciaPrisma) return null;

    return LicenciaPrismaMapper.fromPrismaToEntity(licenciaPrisma);
  };

  public async getLicenciaByConductorId(conductorID: string): Promise<Licencia | null> {
    const licenciaPrisma = await this.prisma.licencias.findFirst({
      where: {
        id_conductor: conductorID
      }
    });

    if (!licenciaPrisma) return null;

    return LicenciaPrismaMapper.fromPrismaToEntity(licenciaPrisma);
  };

  public async update (id: number, licencia: Licencia): Promise<Licencia> {
    const licenciaPrisma = await this.prisma.licencias.update({
      where: {
        numero: id
      },
      data: {
        numero: licencia.getNumero(),
        categoria: licencia.getCategoria(),
        fechavencimiento: licencia.getFechaVenc()
      }
    });

    return new Licencia(
      licenciaPrisma.categoria,
      licenciaPrisma.fechavencimiento,
      licenciaPrisma.numero,
      licenciaPrisma.id_conductor
    );
  }


  public async delete(id: number) {
    await this.prisma.licencias.delete({
      where: {
        numero: id
      }
    }
    );
  };

  public async create(licencia: Licencia): Promise<void> {
    await this.prisma.licencias.create({
      data: {
        numero: licencia.getNumero(),
        categoria: licencia.getCategoria(),
        fechavencimiento: licencia.getFechaVenc(),
        id_conductor: licencia.getIdConductor()
      }
    });
  }
}

