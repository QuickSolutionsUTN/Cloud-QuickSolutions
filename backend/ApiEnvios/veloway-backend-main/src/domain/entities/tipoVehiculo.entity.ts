export class TipoVehiculo {
  constructor(
    private readonly id: number,
    private nombre: string
  ) {}


  public getId(): number {
    return this.id;
  }

  public getNombre(): string {
    return this.nombre;
  }

  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }
}