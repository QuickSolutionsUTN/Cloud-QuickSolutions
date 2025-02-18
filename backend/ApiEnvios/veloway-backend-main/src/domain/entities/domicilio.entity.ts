import { type Envio } from './envio.entity';
import { type Localidad } from './localidad.entity';
import { type Usuario } from './usuario.entity';

export class Domicilio {
  constructor(
    private readonly id: number,
    private calle: string,
    private numero: number,
    private localidad: Localidad,
    private piso?: number | null,
    private depto?: string | null,
    private descripcion?: string | null,
    private usuario?: Usuario | null,
    private envios?: Envio[]
  ) {}

  // Getters
  public getID(): number {
    return this.id;
  }

  public getCalle(): string {
    return this.calle;
  }

  public getNumero(): number {
    return this.numero;
  }

  public getLocalidad(): Localidad {
    return this.localidad;
  }

  public getPiso(): number | null | undefined {
    return this.piso;
  }

  public getDepto(): string | null | undefined {
    return this.depto;
  }

  public getDescripcion(): string | null | undefined {
    return this.descripcion;
  }

  public getUsuario(): Usuario | null | undefined {
    return this.usuario;
  }

  public getEnvios(): Envio[] | undefined {
    return this.envios;
  }

  // Setters
  public setCalle(calle: string): void {
    this.calle = calle;
  }

  public setNumero(numero: number): void {
    this.numero = numero;
  }

  public setLocalidad(localidad: Localidad): void {
    this.localidad = localidad;
  }

  public setPiso(piso: number | null): void {
    this.piso = piso;
  }

  public setDepto(depto: string | null): void {
    this.depto = depto;
  }

  public setDescripcion(descripcion: string | null): void {
    this.descripcion = descripcion;
  }

  public setUsuario(usuario: Usuario | null): void {
    this.usuario = usuario;
  }

  public setEnvios(envios: Envio[]): void {
    this.envios = envios;
  }

  // methods
  public addEnvio(envio: Envio): void {
    this.envios?.push(envio);
  }
}