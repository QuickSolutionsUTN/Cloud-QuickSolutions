import { Domicilio } from '../../domain/entities/domicilio.entity';
import { Localidad } from '../../domain/entities/localidad.entity';
import { Provincia } from '../../domain/entities/provincia.entity';
import { type PostDomicilioDto } from '../dtos/domicilio/postDomicilio.dto';
import { type UpdateDomicilioDto } from '../dtos/domicilio/updateDomicilio.dto';

export class DomicilioMapper {
  public static fromPostDtoToEntity(
    domicilioDto: PostDomicilioDto,
    localidad: Localidad
  ): Domicilio {
    return new Domicilio(
      0,
      domicilioDto.calle,
      domicilioDto.numero,
      new Localidad(
        localidad.getID(),
        localidad.getCodigoPostal(),
        localidad.getNombre(),
        new Provincia(
          localidad.getProvincia().getID(),
          localidad.getProvincia().getNombre()
        )
      ),
      domicilioDto.piso,
      domicilioDto.depto,
      domicilioDto.descripcion
    );
  }

  public static fromUpdateDtoToEntity(
    domicilioDto: UpdateDomicilioDto,
    domicilio: Domicilio
  ): Domicilio {
    return new Domicilio(
      domicilio.getID(),
      domicilioDto.calle,
      domicilioDto.numero,
      domicilio.getLocalidad(),
      domicilioDto.piso,
      domicilioDto.depto,
      domicilioDto.descripcion
    );
  }
}