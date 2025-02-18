import { type Request, type Response } from 'express';
import { LocalidadesService } from '../../application/services/localidades.service';
import { Injectable } from '../../infrastructure/dependencies/injectable.dependency';
import { HandleError } from '../errors/handle.error';

@Injectable()
export class LocalidadesController {
  constructor(private readonly localidadesService: LocalidadesService) {}

  getAll = async (_req: Request, res: Response) => {
    try {
      const localidades = await this.localidadesService.getAll();
      res.status(200).json(localidades);
    } catch (error) {
      HandleError.throw(error, res);
    }
  };
};