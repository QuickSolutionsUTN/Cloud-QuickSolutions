export class Coordenada {
  constructor(
    private idCoordenadas: number,
    private latitud: number,
    private longitud: number
  ) {}

  // Geters
  public getIdCoordenadas(): number {
    return this.idCoordenadas;
  }

  public getLatitud(): number {
    return this.latitud;
  }

  public getLongitud(): number {
    return this.longitud;
  }

  // Setters
  public setIdCoordenada(idCoordenadas: number): void {
    this.idCoordenadas = idCoordenadas;
  }

  public setLatitud(latitud: number): void {
    this.latitud = latitud;
  }

  public setLongitud(longitud: number): void {
    this.longitud = longitud;
  };
}