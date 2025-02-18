import { type PostDomicilioDto } from '../domicilio/postDomicilio.dto';
import { postEnvioValidation } from '../../validations/envio/postEnvio.validation';

export class PostEnvioDto {
  private constructor(
    public descripcion: string,
    public hora: Date,
    public pesoGramos: number,
    public reserva: boolean,
    public origen: PostDomicilioDto,
    public destino: PostDomicilioDto,
    public clienteID: string
  ) {}

  public static create(envio: any): [string?, PostEnvioDto?] {
    const envioValidation = postEnvioValidation(envio);

    if (!envioValidation.success) {
      return [JSON.parse(envioValidation.error.message)];
    }

    // Convierte la hora en formato Date para poder guardarla en la base de datos
    const horaDate = new Date();
    horaDate.setHours(Number(envioValidation.data.hora.split(':')[0]));
    horaDate.setMinutes(Number(envioValidation.data.hora.split(':')[1]));
    horaDate.setSeconds(0, 0);

    return [undefined, new PostEnvioDto(
      envioValidation.data.descripcion,
      horaDate,
      envioValidation.data.pesoGramos,
      envioValidation.data.reserva,
      envioValidation.data.origen,
      envioValidation.data.destino,
      envioValidation.data.cliente
    )];
  }
}