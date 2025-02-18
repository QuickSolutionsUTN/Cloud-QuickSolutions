import { type Request, type Response } from 'express';
import { HandleError } from '../errors/handle.error';
import { GetLicenciaDto } from '../../application/dtos/licencia/getLicencia.dto';
import { PostLicenciaDto } from '../../application/dtos/licencia/postLicencia.dto';
import { UpdateLicenciaDto } from '../../application/dtos/licencia/updateLicencia.dto';
import { LicenciasService } from '../../application/services/licencias.service';
import { Injectable } from '../../infrastructure/dependencies/injectable.dependency';

@Injectable()
export class LicenciasController {
  constructor(
    private readonly licenciasService: LicenciasService
  ) {}

  getAll = async (_req: Request, res: Response) => {
    try {
      const licencias = await this.licenciasService.getAll();
      const licenciasDto = licencias.map((licencia) => GetLicenciaDto.create(licencia));
      res.status(200).json(licenciasDto);
    } catch (error) {
      HandleError.throw(error, res);
    }
  };

  getLicenciaByConductorId = async (req: Request, res: Response) => {
    const { conductorID } = req.params;
    try {
      const licencia = await this.licenciasService.getLicenciaByConductorId(conductorID);
      const licenciaDto = GetLicenciaDto.create(licencia);
      res.status(200).json(licenciaDto);
    } catch (error) {
      HandleError.throw(error, res);
    }
  };

  getLicencia = async (req: Request, res: Response) => {
    const { licenciaID } = req.params;
    try {
      const licencia = await this.licenciasService.getLicencia(Number(licenciaID));
      const licenciaDto = GetLicenciaDto.create(licencia);
      res.status(200).json(licenciaDto);
    } catch (error) {
      HandleError.throw(error, res);
    }
  };

  create = async (req: Request, res: Response) => {
    const newLicencia = req.body;
    if (!newLicencia) {
      res.status(400).json({ message: 'No se han completados todos los campos' });
      return;
    }

    const [error, postLicenciaDto] = PostLicenciaDto.create(newLicencia);
    if (error) {
      res.status(400).json({ message: error });
      return;
    }

    if (postLicenciaDto) {
      try {
        await this.licenciasService.create(postLicenciaDto);
        res.status(201).json({ message: 'Licencia creada correctamente', postLicenciaDto });
      } catch (error) {
        HandleError.throw(error, res);
      }
    }
  };

  update = async (req: Request, res: Response) => {
    const { licenciaID } = req.params;
    const updateLicencia = req.body;
    if (!updateLicencia) {
      res.status(400).json({ message: 'Request body is empty' });
      return;
    }

    const [error, updateLicenciaDto] = UpdateLicenciaDto.create(updateLicencia);
    if (error) {
      res.status(400).json({ message: error });
      return;
    }

    if (updateLicenciaDto) {
      try {
        const licencia = await this.licenciasService.update(Number(licenciaID), updateLicenciaDto);
        const licenciaDto = GetLicenciaDto.create(licencia);
        res.status(200).json(licenciaDto);
      } catch (error) {
        HandleError.throw(error, res);
      }
    }
  };
}