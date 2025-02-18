import { type Request, type Response } from 'express';
import { TipoVehiculoService } from '../../application/services/tipoVehiculo.service';
import { Injectable } from '../../infrastructure/dependencies/injectable.dependency';
import { HandleError } from '../errors/handle.error';

@Injectable()
export class TipoVehiculoController {
  constructor(
    private readonly tipoVehiculoService: TipoVehiculoService
  ) {}

  getAllTiposVehiculo = async (_req: Request, res: Response): Promise<void> => {
    try {
      const tiposVehiculo = await this.tipoVehiculoService.getAllTiposVehiculo();
      res.status(200).json(tiposVehiculo);
    } catch (error) {
      HandleError.throw(error, res);
    }
  };
}