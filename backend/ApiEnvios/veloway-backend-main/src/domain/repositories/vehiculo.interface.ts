import { type Vehiculo } from '../entities/vehiculo.entity';

export interface IVehiculoRepository {
  create(vehiculo: Vehiculo): Promise<void>
  update(vehiculo: Vehiculo): Promise<void>
  delete(conductorId: string): Promise<void>
  getById(vehiculoId: number): Promise<Vehiculo | null>
  getAll(): Promise<Vehiculo[]>
  getByConductorId(conductorId: string): Promise<Vehiculo | null>
  getByPatente(patente: string): Promise<Vehiculo | null>
}