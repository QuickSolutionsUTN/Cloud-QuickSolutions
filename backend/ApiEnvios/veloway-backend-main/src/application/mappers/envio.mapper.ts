import { type PostEnvioDto } from '../../application/dtos/envio/postEnvio.dto';
import { type Domicilio } from '../../domain/entities/domicilio.entity';
import { Envio } from '../../domain/entities/envio.entity';
import { type Localidad } from '../../domain/entities/localidad.entity';
import { type Usuario } from '../../domain/entities/usuario.entity';
import { type UpdateEnvioDto } from '../dtos/envio/udpateEnvio.dto';

interface IFromPostDtoToEntity {
  postEnvioDto: PostEnvioDto
  origen: Domicilio
  destino: Domicilio
  cliente: Usuario
}

interface IFromUpdateDtoToEntity {
  updateEnvioDto: UpdateEnvioDto
  existingEnvio: Envio
  localidadOrigen: Localidad
  localidadDestino: Localidad
}

export class EnvioMapper {
  public static fromPostDtoToEntity(
    {
      postEnvioDto,
      origen,
      destino,
      cliente
    }: IFromPostDtoToEntity): Envio {
    return new Envio(
      0,
      postEnvioDto.descripcion,
      undefined, // fecha actual por defecto
      postEnvioDto.hora,
      postEnvioDto.pesoGramos,
      undefined, // monto calculado en el constructor
      postEnvioDto.reserva,
      undefined, // estado por defecto
      origen,
      destino,
      cliente
    );
  }

  public static fromUpdateDtoToEntity(
    {
      updateEnvioDto,
      existingEnvio,
      localidadOrigen,
      localidadDestino
    }: IFromUpdateDtoToEntity): Envio {
    existingEnvio.getOrigen().setCalle(updateEnvioDto.origen.calle);
    existingEnvio.getOrigen().setNumero(updateEnvioDto.origen.numero);
    existingEnvio.getOrigen().setPiso(updateEnvioDto.origen.piso);
    existingEnvio.getOrigen().setDepto(updateEnvioDto.origen.depto);
    existingEnvio.getOrigen().setDescripcion(updateEnvioDto.origen.descripcion);
    existingEnvio.getOrigen().setLocalidad(localidadOrigen);

    existingEnvio.getDestino().setCalle(updateEnvioDto.destino.calle);
    existingEnvio.getDestino().setNumero(updateEnvioDto.destino.numero);
    existingEnvio.getDestino().setPiso(updateEnvioDto.destino.piso);
    existingEnvio.getDestino().setDepto(updateEnvioDto.destino.depto);
    existingEnvio.getDestino().setDescripcion(updateEnvioDto.destino.descripcion);
    existingEnvio.getDestino().setLocalidad(localidadDestino);

    return new Envio(
      existingEnvio.getNroSeguimiento(),
      updateEnvioDto.descripcion,
      existingEnvio.getFecha(),
      updateEnvioDto.hora,
      updateEnvioDto.pesoGramos,
      existingEnvio.calcularMonto(),
      existingEnvio.getReserva(),
      existingEnvio.getEstado(),
      existingEnvio.getOrigen(),
      existingEnvio.getDestino(),
      existingEnvio.getCliente()
    );
  }
}