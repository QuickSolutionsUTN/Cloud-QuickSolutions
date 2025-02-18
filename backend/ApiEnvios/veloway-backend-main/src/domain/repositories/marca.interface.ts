import { type Marca } from '../entities/marca.entity';

export interface IMarcaRepository {
  create(marca: Marca): Promise<void>
  update(marca: Marca): Promise<void>
  delete(id: number): Promise<void>
  getById(id: number): Promise<Marca | null>
  getAll(): Promise<Marca[]>
}