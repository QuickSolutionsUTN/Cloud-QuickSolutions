import { type Localidad } from './localidad.entity';

export class Provincia {
  constructor(
    private readonly id: number,
    private nombre: string,
    private localidades?: Localidad[]
  ) {}

  // Getter
  public getID(): number {
    return this.id;
  }

  public getNombre(): string {
    return this.nombre;
  }

  public getLocalidades(): Localidad[] | undefined {
    return this.localidades;
  }

  // Setters
  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }

  public setLocalidades(localidades: Localidad[]): void {
    this.localidades = localidades;
  }

  public addLocalidad(localidad: Localidad): void {
    if (this.localidades) {
      this.localidades.push(localidad);
    } else {
      this.localidades = [localidad];
    }
  }
}