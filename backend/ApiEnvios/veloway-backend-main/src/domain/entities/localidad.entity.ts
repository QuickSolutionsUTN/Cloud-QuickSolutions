import { type Domicilio } from './domicilio.entity';
import { type Provincia } from './provincia.entity';

export class Localidad {
  constructor(
    private readonly id: number,
    private codigoPostal: number,
    private nombre: string,
    private provincia: Provincia,
    private domicilios?: Domicilio[]
  ) {}

  // getters
  public getID(): number {
    return this.id;
  }

  public getCodigoPostal(): number {
    return this.codigoPostal;
  }

  public getNombre(): string {
    return this.nombre;
  }

  public getProvincia(): Provincia {
    return this.provincia;
  }

  public getDomicilios(): Domicilio[] | undefined {
    return this.domicilios;
  }

  // setters
  public setCodigoPostal(codigoPostal: number): void {
    this.codigoPostal = codigoPostal;
  }

  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }

  public setProvincia(provincia: Provincia): void {
    this.provincia = provincia;
  }

  public setDomicilios(domicilios: Domicilio[]): void {
    this.domicilios = domicilios;
  }

  // methods
  public addDomicilio(domicilio: Domicilio): void {
    this.domicilios?.push(domicilio);
  }
}