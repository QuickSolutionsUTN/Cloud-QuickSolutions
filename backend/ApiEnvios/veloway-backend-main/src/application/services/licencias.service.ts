import { type Licencia } from '../../domain/entities/licencia.entity';
import { type ILicenciaRepository } from '../../domain/repositories/licencia.interface';
import { Inject, Injectable } from '../../infrastructure/dependencies/injectable.dependency';
import { REPOSITORIES_TOKENS } from '../../infrastructure/dependencies/repositories-tokens.dependency';
import { CustomError } from '../errors/custom.errors';
import { type UpdateLicenciaDto } from '../dtos/licencia/updateLicencia.dto';
import { type PostLicenciaDto } from '../dtos/licencia/postLicencia.dto';
import { LicenciaMapper } from '../mappers/licencia.mapper';

@Injectable()
export class LicenciasService {
  constructor(
    @Inject(REPOSITORIES_TOKENS.ILicenciasRepository) private readonly licenciaRepository: ILicenciaRepository
  ) {}

  public async getAll(): Promise<Licencia[]> {
    const licencias = await this.licenciaRepository.getAll();

    if (licencias.length === 0) throw CustomError.notFound('No se encontraron licencias');
    return licencias;
  }

  public async getLicencia(licenciaID: number): Promise<Licencia> {
    const licencia = await this.licenciaRepository.getLicencia(licenciaID);

    if (!licencia) throw CustomError.notFound(`No se encontró una licencia con el número: ${licenciaID}`);
    return licencia;
  }

  public async getLicenciaByConductorId(conductorID: string): Promise<Licencia> {
    const licenciaByConductorId = await this.licenciaRepository.getLicenciaByConductorId(conductorID);

    if (!licenciaByConductorId) throw CustomError.notFound(`No se encontró una licencia para el conductor con id: ${conductorID}`);
    return licenciaByConductorId;
  }

  public async create(postLicenciaDto: PostLicenciaDto): Promise<void> {
    const licencia = LicenciaMapper.fromPostDtoToEntity(postLicenciaDto);
    await this.licenciaRepository.create(licencia);
  }

  public async update(id: number, updateLicenciaDto: UpdateLicenciaDto): Promise<Licencia> {
    const licencia = await this.getLicencia(id);
    const updatedLicencia = LicenciaMapper.fromUpdateDtoToEntity(updateLicenciaDto, licencia);
    const licenciaUpdated = await this.licenciaRepository.update(id, updatedLicencia);
    return licenciaUpdated;
  }
}