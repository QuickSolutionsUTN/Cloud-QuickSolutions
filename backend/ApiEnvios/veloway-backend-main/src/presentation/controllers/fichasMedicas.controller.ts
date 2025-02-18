import { type Request, type Response } from 'express';
import { HandleError } from '../errors/handle.error';
import { GetFichaMedicaDto } from '../../application/dtos/ficha-medica/getFichaMedica.dto';
import { PostFichaMedicaDto } from '../../application/dtos/ficha-medica/postFichaMedica.dto';
import { UpdateFichaMedica } from '../../application/dtos/ficha-medica/updateFichaMedica.dto';
import { FichasMedicasService } from '../../application/services/fichasMedicas.service';
import { Injectable } from '../../infrastructure/dependencies/injectable.dependency';

@Injectable()
export class FichasMedicasController {
  constructor(
    private readonly fichaMedicaService: FichasMedicasService
  ) {}

  getAll = async (_req: Request, res: Response) => {
    try {
      const fichasMedicas = await this.fichaMedicaService.getAll();
      const fichasMedicasDto = fichasMedicas.map((fichaMedica) => GetFichaMedicaDto.create(fichaMedica));
      res.status(200).json(fichasMedicasDto);
    } catch (error) {
      HandleError.throw(error, res);
    }
  };

  getFichaMedicaByConductorId = async (req: Request, res: Response) => {
    const { conductorID } = req.params;
    try {
      const fichaMedica = await this.fichaMedicaService.getFichaMedicaByConductorId(conductorID);
      const fichaMedicaDto = GetFichaMedicaDto.create(fichaMedica);
      res.status(200).json(fichaMedicaDto);
    } catch (error) {
      HandleError.throw(error, res);
    }
  };

  getFichaMedica = async (req: Request, res: Response) => {
    const { fichaMedicaID } = req.params;
    try {
      const fichaMedica = await this.fichaMedicaService.getFichaMedica(Number(fichaMedicaID));
      const fichaMedicaDto = GetFichaMedicaDto.create(fichaMedica);
      res.status(200).json(fichaMedicaDto);
    } catch (error) {
      HandleError.throw(error, res);
    }
  };

  create = async (req: Request, res: Response) => {
    const newFichaMedica = req.body;
    if (!newFichaMedica) {
      res.status(400).json({ message: 'Request body is empty' });
      return;
    }

    const [error, postFichaMedicaDto] = PostFichaMedicaDto.create(newFichaMedica);
    if (error) {
      res.status(400).json({ message: error });
      return;
    }

    if (postFichaMedicaDto) {
      try {
        const fichaMedica = await this.fichaMedicaService.create(postFichaMedicaDto);
        const fichaMedicaDto = GetFichaMedicaDto.create(fichaMedica);
        res.status(201).json(fichaMedicaDto);
      } catch (error) {
        HandleError.throw(error, res);
      }
    }
  };

  update = async (req: Request, res: Response) => {
    const { fichaMedicaID } = req.params;
    const updateFichaMedica = req.body;
    if (!updateFichaMedica) {
      res.status(400).json({ message: 'Request body is empty' });
      return;
    }

    const [error, updateFichaMedicaDto] = UpdateFichaMedica.create(updateFichaMedica);
    if (error) {
      res.status(400).json({ message: error });
      return;
    }

    if (updateFichaMedicaDto) {
      try {
        const fichaMedica = await this.fichaMedicaService.update(Number(fichaMedicaID), updateFichaMedicaDto);
        const fichaMedicaDto = GetFichaMedicaDto.create(fichaMedica);
        res.status(200).json(fichaMedicaDto);
      } catch (error) {
        HandleError.throw(error, res);
      }
    }
  };
}