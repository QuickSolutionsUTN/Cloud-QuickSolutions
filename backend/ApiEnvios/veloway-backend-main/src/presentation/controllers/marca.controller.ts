import { type Request, type Response } from 'express';
import { HandleError } from '../errors/handle.error';
import { Injectable } from '../../infrastructure/dependencies/injectable.dependency';
import { MarcasService } from '../../application/services/marcas.service';

@Injectable()
export class MarcaController {
  constructor(
    private readonly marcasService: MarcasService
  ) {}

  getAllMarcas = async (_req: Request, res: Response): Promise<void> => {
    try {
      const marcas = await this.marcasService.getAllMarcas();
      res.status(200).json(marcas);
    } catch (error) {
      HandleError.throw(error, res);
    }
  };
}