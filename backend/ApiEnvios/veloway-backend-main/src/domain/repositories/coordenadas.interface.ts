import { type Coordenada } from '../entities/coordenada.entity';

export interface ICoordenadaRepository {
  create: (coordenada: Coordenada) => Promise<number>
  getAll: () => Promise<Coordenada[]>
  getCoordenadas: (idCoordenadas: number) => Promise<Coordenada | null>
  delete: (idCoordenada: number) => Promise<void>
}