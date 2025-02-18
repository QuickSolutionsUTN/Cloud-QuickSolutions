import { type Prisma } from '@prisma/client';
import { Conductor } from '../../domain/entities/conductor.entity';
import { EstadoConductor } from '../../domain/entities/estadoConductor.entity';

interface IConductoresPrismaMapper extends Prisma.conductoresGetPayload<
{
  include: {
    usuarios: true
  }
}
> {}

export class ConductorPrismaMapper {
  public static fromPrismaToEntity(conductor: IConductoresPrismaMapper): Conductor {
    const {
      id_estado,
      id_conductor,
      usuarios: {
        id_usuario,
        dni,
        email,
        password,
        fecha_nac,
        nombre,
        apellido,
        es_conductor,
        telefono,
        api_key,
        is_active
      }
    } = conductor;

    return new Conductor(
      id_conductor,
      new EstadoConductor(
        id_estado,
        nombre
      ),
      id_usuario,
      dni,
      email,
      password,
      fecha_nac,
      nombre,
      apellido,
      es_conductor,
      is_active,
      api_key,
      telefono
    );
  };

  public static fromPrismaArrayToEntity(conductores: IConductoresPrismaMapper[]): Conductor[] {
    return conductores.map((conductor) => this.fromPrismaToEntity(conductor));
  };
};