import { type Conductor } from '../entities/conductor.entity';

export interface IConductoresRepository {
  create: (conductor: Conductor) => Promise<void>
  buscarConductorParaAhora: (horaFin: Date, provinciaId: number) => Promise<string | null>
  buscarConductorParaReserva: (horaInicio: Date, horaFin: Date, provinciaId: number) => Promise<string | null>
  getConductor: (idConductor: string) => Promise<Conductor | null>
}