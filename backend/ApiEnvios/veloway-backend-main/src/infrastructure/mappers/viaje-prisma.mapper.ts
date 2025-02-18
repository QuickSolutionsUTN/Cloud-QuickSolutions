import { type Prisma } from '@prisma/client';
import { Viaje } from '../../domain/entities/viaje.entity';
import { Usuario } from '../../domain/entities/usuario.entity';
import { Envio } from '../../domain/entities/envio.entity';
import { EstadoEnvio } from '../../domain/entities/estadoEnvio.entity';
import { Domicilio } from '../../domain/entities/domicilio.entity';
import { Localidad } from '../../domain/entities/localidad.entity';
import { Provincia } from '../../domain/entities/provincia.entity';
import { Coordenada } from '../../domain/entities/coordenada.entity';

interface IViajesPrismaMapper extends Prisma.viajesGetPayload<
{
  include: {
    envios: {
      include: {
        usuarios: true
        estados_envio: true
        domicilios_envios_id_origenTodomicilios: {
          include: {
            localidades: {
              include: {
                provincias: true
              }
            }
          }
        }
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
    }
    coordenadas_viajes_origen_cordTocoordenadas: true
    coordenadas_viajes_destino_cordTocoordenadas: true
  }
}
> {}

export class ViajePrismaMapper {
  public static fromPrismaToEntity(viaje: IViajesPrismaMapper): Viaje {
    const {
      id_viaje,
      checkpoint_actual,
      fecha_inicio,
      fecha_fin,
      id_conductor,
      envios,
      coordenadas_viajes_origen_cordTocoordenadas: origen_cord,
      coordenadas_viajes_destino_cordTocoordenadas: destino_cord
    } = viaje;

    return new Viaje(
      id_viaje,
      checkpoint_actual,
      fecha_inicio,
      fecha_fin,
      id_conductor,
      new Envio(
        Number(envios.nro_seguimiento.toString()),
        envios.descripcion,
        envios.fecha,
        envios.hora,
        parseFloat(envios.peso_gramos.toString()),
        Number(envios.monto),
        envios.reserva,
        new EstadoEnvio(
          envios.estados_envio.id_estado,
          envios.estados_envio.nombre
        ),
        new Domicilio(
          envios.domicilios_envios_id_origenTodomicilios.id_domicilio,
          envios.domicilios_envios_id_origenTodomicilios.calle,
          envios.domicilios_envios_id_origenTodomicilios.numero,
          new Localidad(
            envios.domicilios_envios_id_origenTodomicilios.localidades.id_localidad,
            envios.domicilios_envios_id_origenTodomicilios.localidades.codigo_postal,
            envios.domicilios_envios_id_origenTodomicilios.localidades.nombre,
            new Provincia(
              envios.domicilios_envios_id_origenTodomicilios.localidades.provincias.id_provincia,
              envios.domicilios_envios_id_origenTodomicilios.localidades.provincias.nombre
            )
          )
        ),
        new Domicilio(
          envios.domicilios_envios_id_destinoTodomicilios.id_domicilio,
          envios.domicilios_envios_id_destinoTodomicilios.calle,
          envios.domicilios_envios_id_destinoTodomicilios.numero,
          new Localidad(
            envios.domicilios_envios_id_destinoTodomicilios.localidades.id_localidad,
            envios.domicilios_envios_id_destinoTodomicilios.localidades.codigo_postal,
            envios.domicilios_envios_id_destinoTodomicilios.localidades.nombre,
            new Provincia(
              envios.domicilios_envios_id_destinoTodomicilios.localidades.provincias.id_provincia,
              envios.domicilios_envios_id_destinoTodomicilios.localidades.provincias.nombre
            )
          )
        ),
        new Usuario(
          envios.usuarios.id_usuario,
          envios.usuarios.dni,
          envios.usuarios.email,
          envios.usuarios.password,
          envios.usuarios.fecha_nac,
          envios.usuarios.nombre,
          envios.usuarios.apellido,
          envios.usuarios.es_conductor,
          envios.usuarios.is_active,
          envios.usuarios.api_key,
          envios.usuarios.telefono
        )
      ),
      new Coordenada(
        origen_cord.id_coordenadas,
        origen_cord.latitud,
        origen_cord.longitud
      ),
      new Coordenada(
        destino_cord.id_coordenadas,
        destino_cord.latitud,
        destino_cord.longitud
      )
    );
  }

  public static fromPrismaArrayToEntity(viajes: IViajesPrismaMapper[]): Viaje[] {
    return viajes.map((viaje) => this.fromPrismaToEntity(viaje));
  }
}

