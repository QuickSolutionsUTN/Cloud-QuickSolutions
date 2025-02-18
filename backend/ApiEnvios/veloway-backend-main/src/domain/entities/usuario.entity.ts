import { type Domicilio } from './domicilio.entity';
import { type Envio } from './envio.entity';

export class Usuario {
  constructor(
    private readonly id: string,
    private dni: number,
    private email: string,
    private password: string,
    private fechaNac: Date,
    private nombre: string,
    private apellido: string,
    private esConductor: boolean,
    private is_active: boolean = true,
    private api_key: string,
    private telefono?: string | null,
    private Domicilio?: Domicilio | null,
    private envios?: Envio[] | null
  ) {}

  // Getters
  public getID(): string {
    return this.id;
  }

  public getDni(): number {
    return this.dni;
  }

  public getEmail(): string {
    return this.email;
  }

  public getPassword(): string {
    return this.password;
  }

  public getFechaNac(): Date {
    return this.fechaNac;
  }

  public getNombre(): string {
    return this.nombre;
  }

  public getApellido(): string {
    return this.apellido;
  }

  public getEsConductor(): boolean {
    return this.esConductor;
  }

  public getTelefono(): string | null | undefined {
    return this.telefono;
  }

  public getEnvios(): Envio[] | null | undefined {
    return this.envios;
  }

  public getApiKey(): string {
    return this.api_key;
  }

  public getIsActive(): boolean {
    return this.is_active;
  }

  public getDomicilio(): Domicilio | null | undefined {
    return this.Domicilio;
  }

  // Setter

  public setPassword(newPassword: string) {
    this.password = newPassword;
  }

  public setNombre(newNombre: string) {
    this.nombre = newNombre;
  }

  public setApellido(newApellido: string) {
    this.apellido = newApellido;
  }

  public setTelefono(newTelefono: string) {
    this.telefono = newTelefono;
  }

  public setApiKey(newApiKey: string) {
    this.api_key = newApiKey;
  }

  public setIsActive(newIsActive: boolean) {
    this.is_active = newIsActive;
  }

  public setEnvios(newEnvios: Envio[]) {
    this.envios = newEnvios;
  }

  public setIdDomicilio (domicilio: Domicilio) {
    this.Domicilio = domicilio;
  }
}