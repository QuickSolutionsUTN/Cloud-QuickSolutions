import { type Envio } from './envio.entity';
import { type Coordenada } from './coordenada.entity';

export class Viaje {
  constructor(
    private readonly idViaje: number,
    private checkpointActual: number,
    private fechaInicio: Date | null,
    private fechaFin: Date | null,
    private idConductor: string,
    private envio: Envio,
    private origenCord: Coordenada,
    private destinoCord: Coordenada
  ) {}

  // Getters
  public getIdViaje(): number {
    return this.idViaje;
  }

  public getCheckpointActual(): number {
    return this.checkpointActual;
  }

  public getFechaInicio(): Date | null {
    return this.fechaInicio;
  }

  public getFechaFin(): Date | null {
    return this.fechaFin;
  }

  public getIdConductor(): string {
    return this.idConductor;
  }


  public getEnvio(): Envio {
    return this.envio;
  }

  public getOrigenCord(): Coordenada {
    return this.origenCord;
  }

  public getDestinoCord(): Coordenada {
    return this.destinoCord;
  }

  // Setters
  public setCheckpointActual(checkpointActual: number): void {
    this.checkpointActual = checkpointActual;
  }

  public setFechaInicio(fechaInicio: Date): void {
    this.fechaInicio = fechaInicio;
  }

  public setFechaFin(fechaFin: Date): void {
    this.fechaFin = fechaFin;
  }

  public setIdConductor(conductor: string): void {
    this.idConductor = conductor;
  }


  public setEnvio(envio: Envio): void {
    this.envio = envio;
  }

  public setOrigenCord(origenCord: Coordenada): void {
    this.origenCord = origenCord;
  }

  public setDestinoCord(destinoCord: Coordenada): void {
    this.destinoCord = destinoCord;
  }
}


