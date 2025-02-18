import { Injectable, Inject } from '../../infrastructure/dependencies/injectable.dependency';
import { REPOSITORIES_TOKENS } from '../../infrastructure/dependencies/repositories-tokens.dependency';
import { Conductor } from '../../domain/entities/conductor.entity';
import { IConductoresRepository } from '../../domain/repositories/conductor.interface';
import { type Usuario } from '../../domain/entities/usuario.entity';
import { EstadoConductor } from '../../domain/entities/estadoConductor.entity';
import { CustomError } from '../errors/custom.errors';

@Injectable()
export class ConductorService {
  constructor(
    @Inject(REPOSITORIES_TOKENS.IConductoresRepository)
    private readonly conductorRepository: IConductoresRepository
  ) {

  }

  public async register(user: Usuario): Promise<string> {
    const newConductor = new Conductor(
      user.getID(),
      new EstadoConductor(1, ''),
      user.getID(),
      user.getDni(),
      user.getEmail(),
      user.getPassword(),
      user.getFechaNac(),
      user.getNombre(),
      user.getApellido(),
      true,
      true,
      user.getApiKey(),
      user.getTelefono()
    );
    await this.conductorRepository.create(newConductor);

    return newConductor.getID();
  }

  public async getConductor(idConductor: string): Promise<Conductor | null> {
    const conductor = await this.conductorRepository.getConductor(idConductor);
    if (!conductor) throw CustomError.notFound('No se encontro un conductor con ese id');
    return conductor;
  }
}

