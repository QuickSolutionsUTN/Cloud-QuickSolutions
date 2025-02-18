import { Coordenada } from '../../domain/entities/coordenada.entity';
import { type Envio } from '../../domain/entities/envio.entity';
import { Viaje } from '../../domain/entities/viaje.entity';
import { ICheckpointsRepository } from '../../domain/repositories/checkpoint.interface';
import { IConductoresRepository } from '../../domain/repositories/conductor.interface';
import { ICoordenadaRepository } from '../../domain/repositories/coordenadas.interface';
import { IViajeRepository } from '../../domain/repositories/viajes.interface';
import { Inject, Injectable } from '../../infrastructure/dependencies/injectable.dependency';
import { REPOSITORIES_TOKENS } from '../../infrastructure/dependencies/repositories-tokens.dependency';
import { obtenerCoordDestino, obtenerCoordOrigen } from '../../infrastructure/geocodingAPI/geocodingApi';
import { postSolicitarAmbulancia } from '../../infrastructure/interactions/ambulancias/postSolicitarAmbulancia';
import { CustomError } from '../errors/custom.errors';

@Injectable()
export class ViajesService {
  constructor (
    @Inject(REPOSITORIES_TOKENS.IViajesRepository) private readonly viajeRepository: IViajeRepository,
    @Inject(REPOSITORIES_TOKENS.ICoordenadasRepository) private readonly coordenadaRepository: ICoordenadaRepository,
    @Inject(REPOSITORIES_TOKENS.ICheckpointsRepository) private readonly checkpointRepository: ICheckpointsRepository,
    @Inject(REPOSITORIES_TOKENS.IConductoresRepository) private readonly conductorRepository: IConductoresRepository
  ) {}

  // recupera un viaje
  public async getViaje(viajeId: number): Promise<Viaje> {
    const viaje = await this.viajeRepository.getViaje(viajeId);

    if (!viaje) throw CustomError.notFound('No se encontro un envio con ese id');
    return viaje;
  }

  // recupera todos los viajes de un conductor
  public async getAllByConductoresId(conductorId: string): Promise<Viaje[]> {
    const viajes = await this.viajeRepository.getAllByConductorId(conductorId);
    if (viajes.length === 0) throw CustomError.notFound('No se encontraron viajes');
    return viajes;
  }

  // crea un viaje
  public async create(envio: Envio, idConductor: string): Promise<number> {
    const origenData = await obtenerCoordOrigen(envio);
    const destinoData = await obtenerCoordDestino(envio);

    if (!origenData || !destinoData) throw CustomError.notFound('No se encontraron coordenandas');

    // create Coordenadas
    const origen = new Coordenada(0, origenData.latitud, origenData.longitud);
    const destino = new Coordenada(0, destinoData.latitud, destinoData.longitud);

    // Guardo las coordenadas en la base de datos
    const origenId = await this.coordenadaRepository.create(origen);
    const destinoId = await this.coordenadaRepository.create(destino);

    if (!origenId || !destinoId) {
      throw CustomError.internalServerError('Error al guardar las coordenadas');
    }

    // actualizo los id
    origen.setIdCoordenada(origenId);
    destino.setIdCoordenada(destinoId);

    // Crear un nuevo objeto Date con la fecha y la hora combinada
    const fecha = envio.getFecha();
    const hora = envio.getHora();
    const fechaHora = new Date(fecha);
    fechaHora.setHours(Number(hora.getHours()));
    fechaHora.setMinutes(Number(hora.getMinutes()));
    fechaHora.setSeconds(0, 0);

    const newViaje = new Viaje(
      0,
      1,
      fechaHora, // Despues lo cambio
      null,
      idConductor,
      envio,
      origen,
      destino
    );

    const viajeId = await this.viajeRepository.create(newViaje);
    return viajeId;
  }

  public async getViajeByNroSeguimiento(nroSeguimiento: number): Promise<Viaje> {
    const viajeEncontrado = await this.viajeRepository.getViajeByNroSeguimiento(nroSeguimiento);

    if (!viajeEncontrado) throw CustomError.notFound('No se encontro el viaje con ese nro de seguimiento');
    return viajeEncontrado;
  }

  public async getViajeActual(idConductor: string): Promise<Viaje> {
    const viajeActualRecuperado = await this.viajeRepository.getViajeActual(idConductor);

    if (!viajeActualRecuperado) throw CustomError.notFound('No se encontro el viaje de ese conductor');
    return viajeActualRecuperado;
  }

  public async updateCheckpointActual(idViaje: number, checkpointActual: number): Promise<void> {
    await this.viajeRepository.updateCheckpointActual(idViaje, checkpointActual);
  }

  public async solicitarAmbulancia(idViaje: number): Promise<void> {
    const viajeRecuperado = await this.viajeRepository.getViaje(idViaje);

    if (!viajeRecuperado) throw new Error(`No se encontro el viaje con id ${idViaje}`);

    const conductorRecuperado = await this.conductorRepository.getConductor(viajeRecuperado?.getIdConductor());

    if (!conductorRecuperado) throw new Error('No se encontro el conductor');

    const checkpointActualRecuperado = await this.checkpointRepository.getCurrentCheckpointByIdViaje(viajeRecuperado);

    if (!checkpointActualRecuperado) throw new Error('No se encontro el checkpointActual');

    await postSolicitarAmbulancia(conductorRecuperado, checkpointActualRecuperado);
  }
}