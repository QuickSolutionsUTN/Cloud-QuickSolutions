// Importar despues entidad Conductor

export class Licencia {
  constructor(
    private categoria: string,
    private fechaVenc: Date,
    private numero: number,
    private idConductor: string
  ) {}

  // Agregar operaciones que tambien me permitan acceder al conductor asociado a la licencia

  // Getters

  public getCategoria(): string {
    return this.categoria;
  }

  public getFechaVenc(): Date {
    return this.fechaVenc;
  }

  public getNumero(): number {
    return this.numero;
  }

  // Hacer get de idConductor
  public getIdConductor(): string {
    return this.idConductor;
  }

  // Setters
  public setIdConductor(idConductor: string): void {
    this.idConductor = idConductor;
  }

  public setCategoria(categoria: string): void {
    this.categoria = categoria;
  }

  public setFechaVenc(fechaVenc: Date): void {
    this.fechaVenc = fechaVenc;
  }
}

