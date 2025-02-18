import { Coordenada } from './coordenada.entity';

export class Checkpoint extends Coordenada {
  constructor(
    private numero: number,
    private idViaje: number,
    idCoordenadas: number,
    latitud: number,
    longitud: number
  ) {
    super(
      idCoordenadas,
      latitud,
      longitud
    );
  }

  // Getters

  public getNumero(): number {
    return this.numero;
  }

  public getIdViaje(): number {
    return this.idViaje;
  }

  // Setters
  public setNumero(numero: number): void {
    this.numero = numero;
  }

  public setIdViaje(idViaje: number): void {
    this.idViaje = idViaje;
  }
}
