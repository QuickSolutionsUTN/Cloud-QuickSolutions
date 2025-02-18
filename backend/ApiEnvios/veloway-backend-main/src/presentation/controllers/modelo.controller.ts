import { type Request, type Response } from 'express';
import { ModelosService } from '../../application/services/modelos.service';
import { Injectable } from '../../infrastructure/dependencies/injectable.dependency';
import { HandleError } from '../errors/handle.error';

@Injectable()
export class ModeloController {
  constructor(
    private readonly modelosService: ModelosService
  ) {}

  getAllByMarcaId = async (req: Request, res: Response): Promise<void> => {
    const marcaId = Number(req.params.marcaId);

    try {
      const modelos = await this.modelosService.getAllByMarcaId(marcaId);
      res.status(200).json(modelos);
    } catch (error) {
      HandleError.throw(error, res);
    }
  };
}