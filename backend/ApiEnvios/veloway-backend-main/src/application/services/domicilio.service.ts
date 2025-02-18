import { Injectable, Inject } from '../../infrastructure/dependencies/injectable.dependency';
import { REPOSITORIES_TOKENS } from '../../infrastructure/dependencies/repositories-tokens.dependency';
import { type PostDomicilioDto } from '../dtos/domicilio/postDomicilio.dto';
import { Domicilio } from '../../domain/entities/domicilio.entity';
import { IDomicilioRepository } from '../../domain/repositories/domicilio.interface';
import { ILocalidadRepository } from '../../domain/repositories/localidad.interface';

@Injectable()
export class DomicilioService {
  constructor(
    @Inject(REPOSITORIES_TOKENS.IDomiciliosRepository) private readonly domicilioRepository: IDomicilioRepository,
    @Inject(REPOSITORIES_TOKENS.ILocalidadesRepository) private readonly localidadRepository: ILocalidadRepository
  ) { }


  public async create(data: PostDomicilioDto, idUser: string): Promise<Domicilio> {
    const {
      calle,
      numero,
      localidadID,
      piso,
      depto,
      descripcion
    } = data;


    const localidad = await this.localidadRepository.getLocalidad(localidadID);

    if (!localidad) {
      throw new Error('La localidad no existe.');
    }

    const domicilio = new Domicilio(
      0,
      calle,
      numero,
      localidad,
      piso,
      depto,
      descripcion
    );


    await this.domicilioRepository.create(domicilio, idUser);

    return domicilio;
  }

  public async modificarDomicilio(id: number, data: any): Promise<void> {
    try {
      // Verificamos si el usuario existe
      const existente = await this.domicilioRepository.getById(id);

      if (!existente) {
        throw new Error('Domicilio no encontrado');
      }

      // Si el usuario existe, procedemos con la actualización
      await this.domicilioRepository.update(id, data);
    } catch (error) {
      console.error('Error en el servicio al modificar usuario:', error);
      throw new Error('No se pudo modificar el usuario');
    }
  }

  async getDomicilioByUsuarioId(usuarioId: string) {
    try {
      const domicilio = await this.domicilioRepository.getDomicilioByUsuarioId(usuarioId);

      if (!domicilio) {
        throw new Error('Domicilio no encontrado');
      }

      return domicilio;
    } catch (error) {
      throw new Error('Error en servicio al obtener domicilio');
    }
  }

  async existLocalidad (localidadId: number) {
    try {
      const localidad = await this.localidadRepository.getLocalidad(localidadId);
      if (localidad) return true;
    } catch (error) {
      throw new Error('No existe la localidad');
    }
  }
}
