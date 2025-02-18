import { type Provincia } from '../entities/provincia.entity';

export interface IProvinciaRepository {
  getAll: () => Promise<Provincia[]>
  getProvincia: (provinciaID: number) => Promise<Provincia | null>
  create: (provincia: Provincia) => Promise<void>
  update: (id: string, provincia: Provincia) => Promise<void>
  delete: (id: string) => Promise<void>
}