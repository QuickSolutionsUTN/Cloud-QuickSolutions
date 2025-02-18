import { type Conductor } from '../../../domain/entities/conductor.entity';

export class GetConductorDto {
  private constructor(
    public idConductor: string,
    public estadoConductor: string,
    public id: string,
    public dni: number,
    public email: string,
    public password: string,
    public fechaNac: Date,
    public nombre: string,
    public apellido: string,
    public esConductor: boolean,
    public is_active: boolean,
    public api_key: string,
    public telefono?: string | null

  ) {}

  public static create(conductor: Conductor): GetConductorDto {
    return new GetConductorDto(
      conductor.getIdConductor(),
      conductor.getEstadoConductor().getNombre(),
      conductor.getID(),
      conductor.getDni(),
      conductor.getEmail(),
      conductor.getPassword(),
      conductor.getFechaNac(),
      conductor.getNombre(),
      conductor.getApellido(),
      conductor.getEsConductor(),
      conductor.getIsActive(),
      conductor.getApiKey(),
      conductor.getTelefono()
    );
  }
}