import { updateEnvioValidation } from '../../validations/envio/udpateEnvio.validation';
import { type UpdateDomicilioDto } from '../domicilio/updateDomicilio.dto';

export class UpdateEnvioDto {
  private constructor(
    public descripcion: string,
    public hora: Date,
    public pesoGramos: number,
    public origen: UpdateDomicilioDto,
    public destino: UpdateDomicilioDto
  ) {}

  public static create(envio: any): [string?, UpdateEnvioDto?] {
    const envioValidation = updateEnvioValidation(envio);

    if (!envioValidation.success) {
      return [JSON.parse(envioValidation.error.message)];
    }

    // Convierte la hora en formato Date para poder guardarla en la base de datos
    const horaDate = new Date();
    horaDate.setHours(Number(envioValidation.data.hora.split(':')[0]));
    horaDate.setMinutes(Number(envioValidation.data.hora.split(':')[1]));
    horaDate.setSeconds(0, 0);

    return [undefined, new UpdateEnvioDto(
      envioValidation.data.descripcion,
      horaDate,
      envioValidation.data.pesoGramos,
      envioValidation.data.origen,
      envioValidation.data.destino
    )];
  }
}