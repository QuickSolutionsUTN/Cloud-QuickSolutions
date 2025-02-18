import { type Prisma } from '@prisma/client';
import { Marca } from '../../domain/entities/marca.entity';
import { Modelo } from '../../domain/entities/modelo.entity';
import { TipoVehiculo } from '../../domain/entities/tipoVehiculo.entity';
import { Vehiculo } from '../../domain/entities/vehiculo.entity';

interface IVehiculoPrisma extends Prisma.vehiculosGetPayload<{
  include: {
    tipos_vehiculos: true
    modelos: {
      include: {
        marcas: true
      }
    }
  }
}> {}

export class VehiculoMapper {
  public static fromPrismaToEntity(vehiculoPrisma: IVehiculoPrisma): Vehiculo {
    return new Vehiculo(
      vehiculoPrisma.id_vehiculo,
      vehiculoPrisma.anio,
      vehiculoPrisma.color,
      vehiculoPrisma.descripcion,
      vehiculoPrisma.patente,
      new TipoVehiculo(
        vehiculoPrisma.tipos_vehiculos.id_tipo_vehiculo,
        vehiculoPrisma.tipos_vehiculos.nombre
      ),
      new Modelo(
        vehiculoPrisma.modelos.id_modelo,
        vehiculoPrisma.modelos.nombre,
        new Marca(
          vehiculoPrisma.modelos.marcas.id_marca,
          vehiculoPrisma.modelos.marcas.nombre
        )
      ),
      vehiculoPrisma.id_conductor
    );
  }

  public static fromPrismaArrayToEntity(vehiculosPrisma: any[]): Vehiculo[] {
    return vehiculosPrisma.map(vehiculoPrisma => this.fromPrismaToEntity(vehiculoPrisma));
  }
}