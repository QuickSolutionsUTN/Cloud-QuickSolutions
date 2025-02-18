import { PrismaClient } from '@prisma/client';
import { type IConductoresRepository } from '../../domain/repositories/conductor.interface';
import { Injectable } from '../dependencies/injectable.dependency';
import { type Conductor } from '../../domain/entities/conductor.entity';
import { ConductorPrismaMapper } from '../mappers/conductor-prisma.mapper';

@Injectable()
export class ConductoresRepository implements IConductoresRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async buscarConductorParaAhora(horaFin: Date, provinciaId: number): Promise<string | null> {
    const conductorDisponible = await this.prisma.conductores.findFirst({
      where: {
        id_estado: 1, // Solo activos
        usuarios: {
          domicilios: {
            localidades: {
              provincias: {
                id_provincia: provinciaId
              }
            }
          }
        },
        viajes: {
          none: { // Niega las condiciones que se encuentran dentro de este bloque
            envios: {
              OR: [
                // Envíos en este momento
                { hora: { lte: new Date() }, reserva: false },
                // Reservas en la próxima hora
                { hora: { lte: horaFin }, reserva: true }
              ]
            }
          }
        }
      },
      select: {
        id_conductor: true
      }
    });

    return conductorDisponible ? conductorDisponible.id_conductor : null;
  }

  public async buscarConductorParaReserva(horaInicio: Date, horaFin: Date, provinciaId: number): Promise<string | null> {
    const conductorDisponible = await this.prisma.conductores.findFirst({
      where: {
        usuarios: {
          domicilios: {
            localidades: {
              provincias: {
                id_provincia: provinciaId
              }
            }
          }
        },
        viajes: {
          none: {
            envios: {
              AND: [
                {
                  fecha: {
                    gte: new Date() // Fecha de envío debe ser igual o posterior a la actual
                  }
                },
                {
                  // Hora del envío debe estar dentro del rango de 1h antes y después
                  hora: {
                    gte: horaInicio, // Mayor o igual a 1h antes
                    lte: horaFin // Menor o igual a 1h después
                  }
                }
              ]
            }
          }
        }
      },
      select: {
        id_conductor: true
      }
    });

    return conductorDisponible ? conductorDisponible.id_conductor : null;
  }

  public async getConductor(idConductor: string): Promise<Conductor | null> {
    const conductorEncontrado = await this.prisma.conductores.findFirst(
      {
        where: {
          id_conductor: idConductor
        },
        include: {
          estados_conductores: true,
          usuarios: true
        }
      }
    );

    if (!conductorEncontrado) return null;
    return ConductorPrismaMapper.fromPrismaToEntity(conductorEncontrado);
  };

  public async create(conductor: Conductor): Promise<void> {
    await this.prisma.conductores.create({
      data: {
        usuarios: {
          connect: {
            id_usuario: conductor.getID()
          }
        },
        estados_conductores: {
          connect: {
            id_estado: conductor.getEstadoConductor().getIdEstado()
          }
        }
      }
    });
  }
}