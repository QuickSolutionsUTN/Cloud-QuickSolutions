import { type Modelo } from '../../../domain/entities/modelo.entity';
import { type TipoVehiculo } from '../../../domain/entities/tipoVehiculo.entity';
import { type Vehiculo } from '../../../domain/entities/vehiculo.entity';

export class GetVehiculoDto {
  private constructor(
    private anio: number,
    private color: string,
    private descripcion: string | null,
    private patente: string,
    private tipoVehiculoId: TipoVehiculo,
    private modelo: Modelo
  ) {}

  public static create(vehiculo: Vehiculo): GetVehiculoDto {
    return new GetVehiculoDto(
      vehiculo.getAnio(),
      vehiculo.getColor(),
      vehiculo.getDescripcion(),
      vehiculo.getPatente(),
      vehiculo.getTipoVehiculo(),
      vehiculo.getModelo()
    );
  }
}