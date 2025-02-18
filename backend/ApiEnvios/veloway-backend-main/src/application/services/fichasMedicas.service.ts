import { type FichaMedica } from '../../domain/entities/fichaMedica.entity';
import { IFichasMedicasRepository } from '../../domain/repositories/fichasMedicas.interface';
import { Inject, Injectable } from '../../infrastructure/dependencies/injectable.dependency';
import { REPOSITORIES_TOKENS } from '../../infrastructure/dependencies/repositories-tokens.dependency';
import { CustomError } from '../errors/custom.errors';
import { type PostFichaMedicaDto } from '../dtos/ficha-medica/postFichaMedica.dto';
import { type UpdateFichaMedica } from '../dtos/ficha-medica/updateFichaMedica.dto';
import { FichaMedicaMapper } from '../mappers/fichaMedica.mapper';

@Injectable()
export class FichasMedicasService {
  constructor(
    @Inject(REPOSITORIES_TOKENS.IFichasMedicasRepository) private readonly fichaMedicaRepository: IFichasMedicasRepository
  ) {}

  public async getAll(): Promise<FichaMedica[]> {
    const fichasMedicas = await this.fichaMedicaRepository.getAll();

    if (fichasMedicas.length === 0) throw CustomError.notFound('No se encontraron fichas medicas');
    return fichasMedicas;
  }

  public async getFichaMedica(fichaMedicaID: number): Promise<FichaMedica> {
    const fichaMedica = await this.fichaMedicaRepository.getFichaMedica(fichaMedicaID);

    if (!fichaMedica) throw CustomError.notFound(`No se encontró una ficha medica con el número: ${fichaMedicaID}`);
    return fichaMedica;
  }

  public async getFichaMedicaByConductorId(conductorID: string): Promise<FichaMedica> {
    const fichaMedicaByConductorId = await this.fichaMedicaRepository.getFichaMedicaByConductorId(conductorID);

    if (!fichaMedicaByConductorId) throw CustomError.notFound(`No se encontró una ficha medica para el conductor con id: ${conductorID}`);
    return fichaMedicaByConductorId;
  }

  public async create(postFichaMedicaDto: PostFichaMedicaDto): Promise<FichaMedica> {
    const fichaMedica = FichaMedicaMapper.fromPostDtoToEntity(postFichaMedicaDto);
    const newFichaMedica = await this.fichaMedicaRepository.create(fichaMedica);
    return newFichaMedica;
  }

  public async update(idFichaMedica: number, updateFichaMedicaDto: UpdateFichaMedica): Promise<FichaMedica> {
    const fichaMedica = await this.getFichaMedica(idFichaMedica);
    const updatedFichaMedica = FichaMedicaMapper.fromUpdateDtoToEntity(updateFichaMedicaDto, fichaMedica);
    const fichaMedicaUpdated = await this.fichaMedicaRepository.update(idFichaMedica, updatedFichaMedica);

    return fichaMedicaUpdated;
  }
}

