// import { type PostDomicilioDto } from '../../application/dtos/domicilio/postDomicilio.dto';
import { type Domicilio } from '../entities/domicilio.entity';

export interface IDomicilioRepository {
  getall: () => Promise<Domicilio[]>
  getDomicilioByProperties: (domicilio: Domicilio) => Promise<Domicilio | null>
  create: (domicilio: Domicilio, idUser: string | undefined) => Promise<Domicilio>
  update: (id: number, domicilio: Domicilio) => Promise<Domicilio>
  delete: (id: number) => Promise<Domicilio>
  getById: (id: number) => Promise<Domicilio | null>
  getDomicilioByUsuarioId: (id: string) => Promise<Domicilio | null>
  createDomicilioEnvio: (domicilio: Domicilio) => Promise<Domicilio>
}