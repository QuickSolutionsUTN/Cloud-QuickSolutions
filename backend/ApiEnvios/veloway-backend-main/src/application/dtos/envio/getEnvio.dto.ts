import { type Domicilio } from '../../../domain/entities/domicilio.entity';
import { type Envio } from '../../../domain/entities/envio.entity';
import { GetUsuarioDto } from '../usuario/getUsuario.dto';

export class GetEnvioDto {
  private constructor(
    public nroSeguimiento: number,
    public descripcion: string,
    public fecha: string,
    public hora: string,
    public pesoGramos: number,
    public monto: number,
    public reserva: boolean,
    public estado: string,
    public origen: Domicilio,
    public destino: Domicilio,
    public cliente: GetUsuarioDto
  ) {}

  public static create(envio: Envio): GetEnvioDto {
    /**
     * Se crea una nueva fecha con la fecha y hora del envío, para que pueda
     * detectar el cambio de día. Si no siempre venia con horario
     * en 00:00:00:000, y no se podía detectar si el utc era del día anterior o del actual.
     */
    const fechaHora = new Date(envio.getFecha().getTime() + envio.getHora().getTime());
    const fecha = fechaHora.toLocaleDateString(
      'es-AR',
      { timeZone: 'America/Argentina/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit' }
    );

    const hora = envio.getHora().toLocaleTimeString(
      'es-AR',
      { timeZone: 'America/Argentina/Buenos_Aires', hour12: false }
    ).slice(0, 5);

    return new GetEnvioDto(
      envio.getNroSeguimiento(),
      envio.getDescripcion(),
      fecha,
      hora,
      envio.getPesoGramos(),
      envio.getMonto(),
      envio.getReserva(),
      envio.getEstado().getNombre(),
      envio.getOrigen(),
      envio.getDestino(),
      GetUsuarioDto.create(envio.getCliente())
    );
  }
}