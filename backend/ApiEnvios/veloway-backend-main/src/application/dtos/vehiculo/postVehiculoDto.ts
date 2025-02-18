import { postVehiculoValidation } from '../../validations/vehiculo/postVehiculo.validation';

export class PostVehiculoDto {
  constructor(
    public readonly anio: number,
    public readonly color: string,
    public readonly descripcion: string | null,
    public readonly patente: string,
    public readonly tipoVehiculoId: number,
    public readonly modeloId: number,
    public readonly marcaId: number,
    public readonly conductorId: string
  ) {}

  public static create(vehiculo: any): [string?, PostVehiculoDto?] {
    const vehiculoValidation = postVehiculoValidation(vehiculo);

    if (!vehiculoValidation.success) {
      return [JSON.parse(vehiculoValidation.error.message)];
    }

    return [undefined, new PostVehiculoDto(
      vehiculoValidation.data.anio,
      vehiculoValidation.data.color,
      vehiculoValidation.data.descripcion,
      vehiculoValidation.data.patente,
      vehiculoValidation.data.tipoVehiculoId,
      vehiculoValidation.data.modeloId,
      vehiculoValidation.data.marcaId,
      vehiculoValidation.data.id_conductor
    )];
  }
}