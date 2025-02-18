import { type Viaje } from '../entities/viaje.entity';

export interface IViajeRepository {
  create(viaje: Viaje): Promise<number>
  updateCheckpointActual(idViaje: number, checkpointActual: number): Promise<void>
  getViaje(viajeId: number): Promise<Viaje | null>
  getAllByConductorId(idConductor: string): Promise<Viaje[]>
  getViajeByNroSeguimiento(nroSeguimiento: number): Promise<Viaje | null>
  getViajeActual(idConductor: string): Promise<Viaje | null>
}