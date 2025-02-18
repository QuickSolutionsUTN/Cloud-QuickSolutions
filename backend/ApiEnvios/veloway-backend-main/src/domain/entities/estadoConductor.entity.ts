export class EstadoConductor {
  constructor(
    public idEstado: number,
    public nombre: string
  ) {}

  // Getters

  public getIdEstado(): number {
    return this.idEstado;
  }

  public getNombre(): string {
    return this.nombre;
  }

  // Setters

  public setIdEstado(idEstado: number): void {
    this.idEstado = idEstado;
  }

  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }
}