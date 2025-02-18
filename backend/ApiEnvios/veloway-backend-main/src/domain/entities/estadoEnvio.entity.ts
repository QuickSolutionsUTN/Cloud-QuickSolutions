export class EstadoEnvio {
  constructor(
    public id: number,
    public nombre: string
  ) {}

  // getters
  public getID(): number {
    return this.id;
  }

  public getNombre(): string {
    return this.nombre;
  }

  // setters
  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }

  public setID(id: number): void {
    this.id = id;
  }
}