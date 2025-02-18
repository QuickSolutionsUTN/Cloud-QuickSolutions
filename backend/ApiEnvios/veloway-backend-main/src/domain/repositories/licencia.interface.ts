import { type Licencia } from '../entities/licencia.entity';

export interface ILicenciaRepository {
  getAll: () => Promise <Licencia[]>
  getLicencia: (licenciaID: number) => Promise<Licencia | null>
  getLicenciaByConductorId: (conductorID: string) => Promise<Licencia | null>
  create: (licencia: Licencia) => Promise<void>
  update: (id: number, licencia: Licencia) => Promise<Licencia>
  delete: (id: number) => Promise<void>
}