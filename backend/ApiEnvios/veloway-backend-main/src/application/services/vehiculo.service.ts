import { Vehiculo } from '../../domain/entities/vehiculo.entity';
import { IConductoresRepository } from '../../domain/repositories/conductor.interface';
import { type IModeloRepository } from '../../domain/repositories/modelo.interface';
import { type ITipoVehiculoRepository } from '../../domain/repositories/tipoVehiculo.interface';
import { type IVehiculoRepository } from '../../domain/repositories/vehiculo.interface';
import { Inject, Injectable } from '../../infrastructure/dependencies/injectable.dependency';
import { REPOSITORIES_TOKENS } from '../../infrastructure/dependencies/repositories-tokens.dependency';
import { TortuarSeguros } from '../../infrastructure/interactions/seguros/tortuarSeguros';
import { type PostVehiculoDto } from '../dtos/vehiculo/postVehiculoDto';
import { CustomError } from '../errors/custom.errors';

@Injectable()
export class VehiculoService {
  constructor(
    @Inject(REPOSITORIES_TOKENS.IVehiculoRepository)
    private readonly vehiculoRepository: IVehiculoRepository,
    @Inject(REPOSITORIES_TOKENS.ITipoVehiculoRepository)
    private readonly tipoVehiculoRepository: ITipoVehiculoRepository,
    @Inject(REPOSITORIES_TOKENS.IModeloRepository)
    private readonly modeloRepository: IModeloRepository,
    @Inject(REPOSITORIES_TOKENS.IConductoresRepository)
    private readonly conductorRepository: IConductoresRepository
  ) {}

  async getAll(): Promise<Vehiculo[]> {
    const vehiculos = await this.vehiculoRepository.getAll();
    if (vehiculos.length === 0) throw CustomError.notFound('No se encontraron vehiculos');
    return vehiculos;
  }

  async getVehiculoById(id: number): Promise<Vehiculo> {
    const vehiculo = await this.vehiculoRepository.getById(id);
    if (!vehiculo) throw CustomError.notFound('Vehiculo no encontrado');
    return vehiculo;
  }

  async getVehiculoByConductorId(conductorId: string): Promise<Vehiculo> {
    const vehiculo = await this.vehiculoRepository.getByConductorId(conductorId);
    if (!vehiculo) throw CustomError.notFound('Vehiculo no encontrado');
    return vehiculo;
  }

  async getVehiculoByPatente(patente: string): Promise<Vehiculo> {
    const vehiculo = await this.vehiculoRepository.getByPatente(patente);
    if (!vehiculo) throw CustomError.notFound('Vehiculo no encontrado');
    return vehiculo;
  }

  async create(vehiculoDto: PostVehiculoDto) {
    const tipoVehiculo = await this.tipoVehiculoRepository.getById(vehiculoDto.tipoVehiculoId);
    if (!tipoVehiculo) throw new Error('Tipo de vehiculo no encontrado');
    const modelo = await this.modeloRepository.getById(vehiculoDto.modeloId);
    if (!modelo) throw new Error('Modelo no encontrado');
    const conductor = await this.conductorRepository.getConductor(vehiculoDto.conductorId);
    if (!conductor) throw new Error('Conductor no encontrado');

    const vehiculo = new Vehiculo(
      0,
      vehiculoDto.anio,
      vehiculoDto.color,
      vehiculoDto.descripcion,
      vehiculoDto.patente.toUpperCase(),
      tipoVehiculo,
      modelo,
      conductor.getID()
    );

    const vehiculoExistente = await this.vehiculoRepository.getByPatente(vehiculoDto.patente.toUpperCase());
    if (vehiculoExistente) throw CustomError.badRequest('El vehiculo ya esta registrado');

    const vehiculoConductor = await this.vehiculoRepository.getByConductorId(vehiculoDto.conductorId);
    if (vehiculoConductor) throw CustomError.badRequest('El Conductor ya tiene un vehiculo registrado');

    const vehiculoAseguradp = await TortuarSeguros.validarSeguro(vehiculoDto.patente.toUpperCase());
    if (!vehiculoAseguradp) throw CustomError.badRequest('El vehiculo no esta asegurado');

    await this.vehiculoRepository.create(vehiculo);
  }

  async update(vehiculoDto: PostVehiculoDto) {
    const vehiculo = await this.vehiculoRepository.getByConductorId(vehiculoDto.conductorId);
    if (!vehiculo) throw CustomError.notFound('Vehiculo no encontrado');

    const tipoVehiculo = await this.tipoVehiculoRepository.getById(vehiculoDto.tipoVehiculoId);
    if (!tipoVehiculo) throw new Error('Tipo de vehiculo no encontrado');

    const modelo = await this.modeloRepository.getById(vehiculoDto.modeloId);
    if (!modelo) throw new Error('Modelo no encontrado');

    vehiculo.setAnio(vehiculoDto.anio);
    vehiculo.setColor(vehiculoDto.color);
    vehiculo.setDescripcion(vehiculoDto.descripcion);
    vehiculo.setPatente(vehiculoDto.patente.toUpperCase());
    vehiculo.setTipoVehiculo(tipoVehiculo);
    vehiculo.setModelo(modelo);

    const vehiculoExistente = await this.vehiculoRepository.getByPatente(vehiculo.getPatente().toUpperCase());
    if (vehiculoExistente) throw CustomError.badRequest('El vehiculo ya esta registrado');

    const vehiculoAsegurado = await TortuarSeguros.validarSeguro(vehiculo.getPatente().toUpperCase());
    if (!vehiculoAsegurado) throw CustomError.badRequest('El vehiculo no esta asegurado');

    const vehiculoConductor = await this.vehiculoRepository.getByConductorId(vehiculo.getConductorId());
    if (vehiculoConductor) throw CustomError.badRequest('El Conductor ya tiene un vehiculo registrado');
  }

  async delete(conductorId: string) {
    const vehiculo = await this.vehiculoRepository.getByConductorId(conductorId);
    if (!vehiculo) throw CustomError.notFound('Vehiculo no encontrado');
    await this.vehiculoRepository.delete(vehiculo.getConductorId());
  }
}