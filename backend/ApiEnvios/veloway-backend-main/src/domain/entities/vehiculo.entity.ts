import { type Modelo } from './modelo.entity';
import { type TipoVehiculo } from './tipoVehiculo.entity';

export class Vehiculo {
  constructor(
    private readonly id: number,
    private anio: number,
    private color: string,
    private descripcion: string | null,
    private patente: string,
    private tipoVehiculo: TipoVehiculo,
    private modelo: Modelo,
    private conductorId: string
  ) {}

  public getId(): number {
    return this.id;
  }

  public getAnio(): number {
    return this.anio;
  }

  public getColor(): string {
    return this.color;
  }

  public getDescripcion(): string | null {
    return this.descripcion;
  }

  public getPatente(): string {
    return this.patente;
  }

  public getTipoVehiculo(): TipoVehiculo {
    return this.tipoVehiculo;
  }

  public getModelo(): Modelo {
    return this.modelo;
  }

  public getConductorId(): string {
    return this.conductorId;
  }

  public setAnio(anio: number): void {
    this.anio = anio;
  }

  public setColor(color: string): void {
    this.color = color;
  }

  public setDescripcion(descripcion: string | null): void {
    this.descripcion = descripcion;
  }

  public setPatente(patente: string): void {
    this.patente = patente;
  }

  public setTipoVehiculo(tipoVehiculo: TipoVehiculo): void {
    this.tipoVehiculo = tipoVehiculo;
  }

  public setModelo(modelo: Modelo): void {
    this.modelo = modelo;
  }

  public setConductorId(conductorId: string): void {
    this.conductorId = conductorId;
  }
}