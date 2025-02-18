export class FichaMedica {
  constructor(
    private altura: number,
    private peso: number,
    private enfermedadCardiaca: string | null,
    private enfermedadRespiratoria: string | null,
    private alergias: string | null,
    private epilepsia: boolean,
    private diabetes: boolean,
    private compartir: boolean,
    private idConductor: string
  ) {}

  // Getters

  public getAltura(): number {
    return this.altura;
  }

  public getPeso(): number {
    return this.peso;
  }

  public getEnfermedadCardiaca(): string | null {
    return this.enfermedadCardiaca;
  }

  public getEnfermedadRespiratoria(): string | null {
    return this.enfermedadRespiratoria;
  }

  public getAlergias(): string | null {
    return this.alergias;
  }

  public getEpilepsia(): boolean {
    return this.epilepsia;
  }

  public getDiabetes(): boolean {
    return this.diabetes;
  }

  public getCompartir(): boolean {
    return this.compartir;
  }

  public getIdConductor(): string {
    return this.idConductor;
  }

  // Setters

  public setAltura(altura: number): void {
    this.altura = altura;
  }

  public setPeso(peso: number): void {
    this.peso = peso;
  }

  public setEnfermedadCardiaca(enfermedadCardiaca: string | null): void {
    this.enfermedadCardiaca = enfermedadCardiaca;
  }

  public setEnfermedadRespiratoria(enfermedadRespiratoria: string | null): void {
    this.enfermedadRespiratoria = enfermedadRespiratoria;
  }

  public setAlergias(alergias: string | null): void {
    this.alergias = alergias;
  }

  public setEpilepsia(epilepsia: boolean): void {
    this.epilepsia = epilepsia;
  }

  public setDiabetes(diabetes: boolean): void {
    this.diabetes = diabetes;
  }

  public setCompartir(compartir: boolean): void {
    this.compartir = compartir;
  }
}