import { PrismaClient } from '@prisma/client';
import { type IViajeRepository } from '../../domain/repositories/viajes.interface';
import { Injectable } from '../dependencies/injectable.dependency';
import { type Viaje } from '../../domain/entities/viaje.entity';
import { ViajePrismaMapper } from '../mappers/viaje-prisma.mapper';

@Injectable()
export class ViajesRepository implements IViajeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(viaje: Viaje): Promise<number> {
    const viajeData = await this.prisma.viajes.create({
      data: {
        checkpoint_actual: viaje.getCheckpointActual(),
        fecha_inicio: viaje.getFechaInicio(),
        fecha_fin: viaje.getFechaFin(),
        id_conductor: viaje.getIdConductor(),
        nro_seguimiento: viaje.getEnvio().getNroSeguimiento(),
        origen_cord: viaje.getOrigenCord().getIdCoordenadas(),
        destino_cord: viaje.getDestinoCord().getIdCoordenadas()
      }
    });
    return Number(viajeData.id_viaje);
  }

  async getAllByConductorId(idConductor: string): Promise<Viaje[]> {
    const viajesPrisma = await this.prisma.viajes.findMany(
      {
        where: {
          id_conductor: idConductor
        },
        include: {
          conductores: {
            include: {
              estados_conductores: true,
              usuarios: true
            }
          },
          envios: {
            include: {
              usuarios: true,
              estados_envio: true,
              domicilios_envios_id_origenTodomicilios: {
                include: {
                  localidades: {
                    include: {
                      provincias: true
                    }
                  }
                }
              },
              domicilios_envios_id_destinoTodomicilios: {
                include: {
                  localidades: {
                    include: {
                      provincias: true
                    }
                  }
                }
              }
            }
          },
          coordenadas_viajes_origen_cordTocoordenadas: true,
          coordenadas_viajes_destino_cordTocoordenadas: true
        }
      }
    );
    return ViajePrismaMapper.fromPrismaArrayToEntity(viajesPrisma);
  }

  async getViaje(viajeId: number): Promise<Viaje | null> {
    const viajeEncontrado = await this.prisma.viajes.findFirst(
      {
        where: {
          id_viaje: viajeId
        },
        include: {
          conductores: {
            include: {
              estados_conductores: true,
              usuarios: true
            }
          },
          envios: {
            include: {
              usuarios: true,
              estados_envio: true,
              domicilios_envios_id_origenTodomicilios: {
                include: {
                  localidades: {
                    include: {
                      provincias: true
                    }
                  }
                }
              },
              domicilios_envios_id_destinoTodomicilios: {
                include: {
                  localidades: {
                    include: {
                      provincias: true
                    }
                  }
                }
              }
            }
          },
          coordenadas_viajes_origen_cordTocoordenadas: true,
          coordenadas_viajes_destino_cordTocoordenadas: true
        }
      }
    );

    if (!viajeEncontrado) {
      return null;
    }

    return viajeEncontrado ? ViajePrismaMapper.fromPrismaToEntity(viajeEncontrado) : null;
  }

  async updateCheckpointActual(idViaje: number, checkpointActual: number): Promise<void> {
    await this.prisma.viajes.update(
      {
        where: {
          id_viaje: idViaje
        },
        data: {
          checkpoint_actual: checkpointActual
        }
      }
    );
  }

  async getViajeByNroSeguimiento(nroSeguimiento: number): Promise<Viaje | null> {
    const viajeEncontrado = await this.prisma.viajes.findFirst(
      {
        where: {
          nro_seguimiento: nroSeguimiento
        },
        include: {
          conductores: {
            include: {
              estados_conductores: true,
              usuarios: true
            }
          },
          envios: {
            include: {
              usuarios: true,
              estados_envio: true,
              domicilios_envios_id_origenTodomicilios: {
                include: {
                  localidades: {
                    include: {
                      provincias: true
                    }
                  }
                }
              },
              domicilios_envios_id_destinoTodomicilios: {
                include: {
                  localidades: {
                    include: {
                      provincias: true
                    }
                  }
                }
              }
            }
          },
          coordenadas_viajes_origen_cordTocoordenadas: true,
          coordenadas_viajes_destino_cordTocoordenadas: true
        }
      }
    );
    return viajeEncontrado ? ViajePrismaMapper.fromPrismaToEntity(viajeEncontrado) : null;
  }

  async getViajeActual(idConductor: string): Promise<Viaje | null> {
    const ahora = new Date();

    const viajeActualRecuperado = await this.prisma.viajes.findFirst({
      where: {
        id_conductor: idConductor,
        envios: {
          id_estado: {
            notIn: [2, 5]
          },
          OR: [
            {
              reserva: false,
              fecha: { lte: ahora },
              hora: { lte: ahora }
            },
            {
              reserva: true,
              fecha: { lte: ahora },
              hora: { lte: ahora }
            }
          ]
        }
      },
      orderBy: {
        fecha_inicio: 'desc'
      },
      include: {
        envios: {
          include: {
            usuarios: true,
            estados_envio: true,
            domicilios_envios_id_origenTodomicilios: {
              include: {
                localidades: {
                  include: {
                    provincias: true
                  }
                }
              }
            },
            domicilios_envios_id_destinoTodomicilios: {
              include: {
                localidades: {
                  include: {
                    provincias: true
                  }
                }
              }
            }
          }
        },
        coordenadas_viajes_origen_cordTocoordenadas: true,
        coordenadas_viajes_destino_cordTocoordenadas: true
      }
    });

    if (!viajeActualRecuperado) {
      return null;
    }

    return viajeActualRecuperado ? ViajePrismaMapper.fromPrismaToEntity(viajeActualRecuperado) : null;
  }
}