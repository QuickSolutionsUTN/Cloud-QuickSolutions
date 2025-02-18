import { Envio } from '../../domain/entities/envio.entity';
import { Domicilio } from '../../domain/entities/domicilio.entity';
import { Localidad } from '../../domain/entities/localidad.entity';
import { Provincia } from '../../domain/entities/provincia.entity';
import { Usuario } from '../../domain/entities/usuario.entity';
import { EstadoEnvio } from '../../domain/entities/estadoEnvio.entity';
import { type Prisma } from '@prisma/client';

interface IEnviosPrismaMapper extends Prisma.enviosGetPayload<
{
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
> {}

export class EnvioPrismaMapper {
  public static fromPrismaToEntity(envio: IEnviosPrismaMapper): Envio {
    const {
      nro_seguimiento,
      descripcion,
      fecha,
      hora,
      peso_gramos,
      monto,
      reserva,
      estados_envio,
      domicilios_envios_id_origenTodomicilios: origen,
      domicilios_envios_id_destinoTodomicilios: destino,
      usuarios
    } = envio;

    return new Envio(
      Number(nro_seguimiento.toString()),
      descripcion,
      fecha,
      hora,
      parseFloat(peso_gramos.toString()),
      Number(monto),
      reserva,
      new EstadoEnvio(
        estados_envio.id_estado,
        estados_envio.nombre
      ),
      new Domicilio(
        origen.id_domicilio,
        origen.calle,
        origen.numero,
        new Localidad(
          origen.localidades.id_localidad,
          origen.localidades.codigo_postal,
          origen.localidades.nombre,
          new Provincia(
            origen.localidades.provincias.id_provincia,
            origen.localidades.provincias.nombre
          )
        ),
        origen.piso,
        origen.depto,
        origen.descripcion
      )
      ,
      new Domicilio(
        destino.id_domicilio,
        destino.calle,
        destino.numero,
        new Localidad(
          destino.localidades.id_localidad,
          destino.localidades.codigo_postal,
          destino.localidades.nombre,
          new Provincia(
            destino.localidades.provincias.id_provincia,
            destino.localidades.provincias.nombre
          )
        ),
        destino.piso,
        destino.depto,
        destino.descripcion
      ),
      new Usuario(
        usuarios.id_usuario,
        usuarios.dni,
        usuarios.email,
        usuarios.password,
        usuarios.fecha_nac,
        usuarios.nombre,
        usuarios.apellido,
        usuarios.es_conductor,
        usuarios.is_active,
        usuarios.api_key,
        usuarios.telefono
      )
    );
  }

  public static fromPrismaArrayToEntity(envios: IEnviosPrismaMapper[]): Envio[] {
    return envios.map((envio) => this.fromPrismaToEntity(envio));
  }
}
