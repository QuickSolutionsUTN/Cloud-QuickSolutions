import { type Request, type Response } from 'express';
import { ViajesService } from '../../application/services/viajes.service';
import { Injectable } from '../../infrastructure/dependencies/injectable.dependency';
import { GetViajeDto } from '../../application/dtos/viaje/getViaje.dto';
import { HandleError } from '../errors/handle.error';
import { GetAllByConductorIdDto } from '../../application/dtos/viaje/getAllByConductorId.dto';
import { GetViajeActualDto } from '../../application/dtos/viaje/getViajeActual.dto';

@Injectable()
export class ViajesController {
  constructor(
    private readonly viajesService: ViajesService
  ) {}

  getAllByConductorId = async (req: Request, res: Response) => {
    const { idConductor } = req.params;
    try {
      const viajes = await this.viajesService.getAllByConductoresId(idConductor);
      const viajesDto = viajes.map((viaje) => GetAllByConductorIdDto.create(viaje));
      res.status(200).json(viajesDto);
    } catch (error) {
      HandleError.throw(error, res);
    }
  };

  getViaje = async (req: Request, res: Response) => {
    const { idViaje } = req.params;
    try {
      const viaje = await this.viajesService.getViaje(Number(idViaje));
      const viajesDto = GetViajeDto.create(viaje);
      res.status(200).json(viajesDto);
    } catch (error) {
      HandleError.throw(error, res);
    }
  };

  getViajeActual = async(req: Request, res: Response) => {
    const { idConductor } = req.params;
    try {
      const viaje = await this.viajesService.getViajeActual(idConductor);
      const viajeDto = GetViajeActualDto.create(viaje);
      res.status(200).json(viajeDto);
    } catch (error) {
      HandleError.throw(error, res);
    }
  };

  updateCheckpointActual = async (req: Request, res: Response) => {
    const { idViaje } = req.params;
    const { checkpointActual } = req.body;

    try {
      await this.viajesService.updateCheckpointActual(Number(idViaje), Number(checkpointActual));
      res.status(200).json({ message: 'Checkpoint actual actualizado' });
    } catch (error) {
      HandleError.throw(error, res);
    }
  };

  solicitarAmbulancia = async (req: Request, res: Response) => {
    const { idViaje } = req.params;
    try {
      await this.viajesService.solicitarAmbulancia(Number(idViaje));
      res.status(200).json({ message: 'Ambulancia solicitada correctamente' });
    } catch (error) {
      HandleError.throw(error, res);
    }
  };
}

