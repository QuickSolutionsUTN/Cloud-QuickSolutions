import { type Modelo } from '../entities/modelo.entity';

export interface IModeloRepository {
  create(modelo: Modelo): Promise<void>
  update(modelo: Modelo): Promise<void>
  delete(id: number): Promise<void>
  getById(id: number): Promise<Modelo | null>
  getAll(): Promise<Modelo[]>
  getAllByMarcaId(marcaId: number): Promise<Modelo[]>
}