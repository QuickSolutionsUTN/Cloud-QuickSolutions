import { type TipoVehiculo } from '../entities/tipoVehiculo.entity';

export interface ITipoVehiculoRepository {
  create(tipoVehiculo: TipoVehiculo): Promise<void>
  update(tipoVehiculo: TipoVehiculo): Promise<void>
  delete(id: number): Promise<void>
  getById(id: number): Promise<TipoVehiculo | null>
  getAll(): Promise<TipoVehiculo[]>
}