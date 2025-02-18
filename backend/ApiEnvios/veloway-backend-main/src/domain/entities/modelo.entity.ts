import { type Marca } from './marca.entity';

export class Modelo {
  constructor(
    private readonly id: number,
    private nombre: string,
    private marca: Marca
  ) {}

  public getId(): number {
    return this.id;
  }

  public getNombre(): string {
    return this.nombre;
  }

  public getMarca(): Marca {
    return this.marca;
  }

  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }

  public setMarca(marca: Marca): void {
    this.marca = marca;
  }
}