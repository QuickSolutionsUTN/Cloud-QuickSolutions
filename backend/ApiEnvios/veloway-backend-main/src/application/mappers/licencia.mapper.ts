import { type PostLicenciaDto } from '../dtos/licencia/postLicencia.dto';
import { type UpdateLicenciaDto } from '../dtos/licencia/updateLicencia.dto';
import { Licencia } from '../../domain/entities/licencia.entity';

export class LicenciaMapper {
  public static fromPostDtoToEntity(postLicenciaDto: PostLicenciaDto): Licencia {
    const { categoria, fechaVenc, numero, idConductor } = postLicenciaDto;

    return new Licencia(
      categoria,
      new Date(fechaVenc),
      numero,
      idConductor
    );
  }

  public static fromUpdateDtoToEntity(updateLicenciaDto: UpdateLicenciaDto, licencia: Licencia): Licencia {
    const { categoria, fechaVenc, numero } = updateLicenciaDto;

    return new Licencia(
      categoria || licencia.getCategoria(),
      fechaVenc || licencia.getFechaVenc(),
      numero || licencia.getNumero(),
      licencia.getIdConductor()
    );
  }
}



