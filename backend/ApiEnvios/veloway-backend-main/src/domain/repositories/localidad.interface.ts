import { type Localidad } from '../entities/localidad.entity';

export interface ILocalidadRepository {
  getAll: () => Promise<Localidad[]>
  getAllByProvincia: (provinciaID: number) => Promise<Localidad[]>
  getLocalidad: (localidadID: number) => Promise<Localidad | null>
  create: (localidad: Localidad) => Promise<void>
  update: (id: string, localidad: Localidad) => Promise<void>
  delete: (id: string) => Promise<void>
}