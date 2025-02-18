import { PrismaClient } from '@prisma/client';
import { Domicilio } from '../../domain/entities/domicilio.entity';
import { type IDomicilioRepository } from '../../domain/repositories/domicilio.interface';
import { Injectable } from '../dependencies/injectable.dependency';
import { Localidad } from '../../domain/entities/localidad.entity';
import { Provincia } from '../../domain/entities/provincia.entity';

@Injectable()
export class DomiciliosRepository implements IDomicilioRepository {
  constructor(private readonly prisma: PrismaClient) { }

  getall: () => Promise<Domicilio[]>;
  delete: (id: number) => Promise<Domicilio>;

  public async getDomicilioByProperties(domicilio: Domicilio): Promise<Domicilio | null> {
    const domicilioData = await this.prisma.domicilios.findFirst({
      where: {
        calle: domicilio.getCalle(),
        numero: domicilio.getNumero(),
        piso: domicilio.getPiso(),
        depto: domicilio.getDepto(),
        localidades: {
          id_localidad: domicilio.getLocalidad().getID()// Al saber la localidad, se sabe la provincia
        }
      }
    });

    if (!domicilioData) return null;

    return new Domicilio(
      domicilioData.id_domicilio,
      domicilioData.calle,
      domicilioData.numero,
      domicilio.getLocalidad(),
      domicilioData.piso,
      domicilioData.depto,
      domicilioData.descripcion
    );
  };

  public async create(domicilio: Domicilio, idUser?: string): Promise<Domicilio> {
    const domicilioPrisma = await this.prisma.domicilios.create({
      data: {
        calle: domicilio.getCalle(),
        numero: domicilio.getNumero(),
        piso: domicilio.getPiso(),
        depto: domicilio.getDepto(),
        descripcion: domicilio.getDescripcion(),
        usuarios: {
          connect: {
            id_usuario: idUser
          }
        },
        localidades: {
          connect: {
            id_localidad: domicilio.getLocalidad().getID()
          }
        }
      }
    });

    return new Domicilio(
      domicilioPrisma.id_domicilio,
      domicilioPrisma.calle,
      domicilioPrisma.numero,
      domicilio.getLocalidad(),
      domicilioPrisma.piso,
      domicilioPrisma.depto,
      domicilioPrisma.descripcion
    );
  }

  public async update(idDomicilio: number, domicilio: Domicilio): Promise<Domicilio> {
    const domicilioPrisma = await this.prisma.domicilios.update({
      where: {
        id_domicilio: idDomicilio
      },
      data: {
        calle: domicilio.getCalle(),
        numero: domicilio.getNumero(),
        piso: domicilio.getPiso(),
        depto: domicilio.getDepto(),
        descripcion: domicilio.getDescripcion(),
        localidades: {
          connect: {
            id_localidad: domicilio.getLocalidad().getID()
          }
        }
      }
    });

    return new Domicilio(
      domicilioPrisma.id_domicilio,
      domicilioPrisma.calle,
      domicilioPrisma.numero,
      domicilio.getLocalidad(),
      domicilioPrisma.piso,
      domicilioPrisma.depto,
      domicilioPrisma.descripcion
    );
  }

  public async getById(idDomicilio: number): Promise<Domicilio | null> {
    try {
      const domicilioData = await this.prisma.domicilios.findUnique({
        where: { id_domicilio: idDomicilio },
        include: {
          localidades: {
            include: {
              provincias: true // Incluimos la provincia dentro de la localidad
            }
          }
        }
      });

      if (!domicilioData) {
        return null;
      }

      const provincia = new Provincia(
        domicilioData.localidades.provincias.id_provincia,
        domicilioData.localidades.provincias.nombre
      );


      const localidad = new Localidad(
        domicilioData.localidades.id_localidad,
        domicilioData.localidades.codigo_postal,
        domicilioData.localidades.nombre,
        provincia
      );

      // Mapear el objeto de Prisma a la clase Domicilio
      return new Domicilio(
        domicilioData.id_domicilio,
        domicilioData.calle,
        domicilioData.numero,
        localidad, domicilioData.piso,
        domicilioData.depto,
        domicilioData.descripcion
      );
    } catch (error) {
      console.error(`Error al obtener el domicilio con ID ${idDomicilio}:`, error);
      throw new Error('Error al obtener el domicilio.');
    }
  }

  public async getDomicilioByUsuarioId(usuarioId: string): Promise<Domicilio | null> {
    try {
      const domicilioData = await this.prisma.domicilios.findUnique({
        where: { id_usuario: usuarioId },
        include: {
          localidades: {
            include: {
              provincias: true // Incluimos la provincia dentro de la localidad
            }
          }
        }
      });

      if (!domicilioData) {
        return null;
      }

      const provincia = new Provincia(
        domicilioData.localidades.provincias.id_provincia,
        domicilioData.localidades.provincias.nombre
      );


      const localidad = new Localidad(
        domicilioData.localidades.id_localidad,
        domicilioData.localidades.codigo_postal,
        domicilioData.localidades.nombre,
        provincia
      );

      // Mapear el objeto de Prisma a la clase Domicilio
      return new Domicilio(
        domicilioData.id_domicilio,
        domicilioData.calle,
        domicilioData.numero,
        localidad, domicilioData.piso,
        domicilioData.depto,
        domicilioData.descripcion
      );
    } catch (error) {
      throw new Error('Error al obtener domicilio para el usuario');
    }
  }

  public async createDomicilioEnvio(domicilio: Domicilio): Promise<Domicilio> {
    const domicilioPrisma = await this.prisma.domicilios.create({
      data: {
        calle: domicilio.getCalle(),
        numero: domicilio.getNumero(),
        piso: domicilio.getPiso(),
        depto: domicilio.getDepto(),
        descripcion: domicilio.getDescripcion(),
        localidades: {
          connect: {
            id_localidad: domicilio.getLocalidad().getID()
          }
        }
      }
    });

    return new Domicilio(
      domicilioPrisma.id_domicilio,
      domicilioPrisma.calle,
      domicilioPrisma.numero,
      domicilio.getLocalidad(),
      domicilioPrisma.piso,
      domicilioPrisma.depto,
      domicilioPrisma.descripcion
    );
  }
}


