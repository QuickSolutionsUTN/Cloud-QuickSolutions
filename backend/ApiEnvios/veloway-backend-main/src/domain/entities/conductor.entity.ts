import { type EstadoConductor } from './estadoConductor.entity';
import { Usuario } from './usuario.entity';

export class Conductor extends Usuario {
  constructor(
    private readonly idConductor: string,
    private estadoConductor: EstadoConductor,
    id: string,
    dni: number,
    email: string,
    contraseña: string,
    fechaNac: Date,
    nombre: string,
    apellido: string,
    esConductor: boolean,
    is_active: boolean,
    api_key: string,
    telefono?: string | null
  ) {
    super(
      id,
      dni,
      email,
      contraseña,
      fechaNac,
      nombre,
      apellido,
      esConductor,
      is_active,
      api_key,
      telefono
    );
    this.idConductor = idConductor;
    this.estadoConductor = estadoConductor;
  }

  // Getters
  public getIdConductor(): string {
    return this.idConductor;
  }

  public getEstadoConductor(): EstadoConductor {
    return this.estadoConductor;
  }

  // Setters

  public setEstadoConductor(estadoConductor: EstadoConductor): void {
    this.estadoConductor = estadoConductor;
  }
}