import { PostVehiculoDto } from '../../application/dtos/vehiculo/postVehiculoDto';
import { VehiculoService } from '../../application/services/vehiculo.service';
import { Injectable } from '../../infrastructure/dependencies/injectable.dependency';
import { HandleError } from '../errors/handle.error';
import { type Request, type Response } from 'express';

@Injectable()
export class VehiculoController {
  constructor(
    private readonly vehiculoService: VehiculoService
  ) {}

  getAll = async (_req: Request, res: Response) => {
    try {
      const vehiculos = await this.vehiculoService.getAll();
      res.status(200).json(vehiculos);
    } catch (error) {
      HandleError.throw(error, res);
    }
  };

  getById = async (req: Request, res: Response) => {
    const { vehiculoId } = req.params;
    if (!vehiculoId) {
      res.status(400).json({ message: 'Id es requerido' });
      return;
    }
    try {
      const vehiculo = await this.vehiculoService.getVehiculoById(Number(vehiculoId));
      res.status(200).json(vehiculo);
    } catch (error) {
      HandleError.throw(error, res);
    }
  };

  getByConductorId = async (req: Request, res: Response) => {
    const { conductorId } = req.params;
    if (!conductorId) {
      res.status(400).json({ message: 'Conductor ID es requerido' });
      return;
    }

    if (!isNaN(Number(conductorId))) {
      res.status(400).json({ message: 'Conductor ID tiene que ser un string' });
      return;
    }

    try {
      const vehiculo = await this.vehiculoService.getVehiculoByConductorId(conductorId);
      res.status(200).json(vehiculo);
    } catch (error) {
      HandleError.throw(error, res);
    }
  };

  getByPatente = async (req: Request, res: Response) => {
    const { patente } = req.params;
    if (!patente) {
      res.status(400).json({ message: 'Patente es requerida' });
      return;
    }

    if (!isNaN(Number(patente))) {
      res.status(400).json({ message: 'Patente tiene que ser un string' });
      return;
    }

    try {
      const vehiculo = await this.vehiculoService.getVehiculoByPatente(patente);
      res.status(200).json(vehiculo);
    } catch (error) {
      HandleError.throw(error, res);
    }
  };

  create = async (req: Request, res: Response) => {
    const [error, vehiculoDto] = PostVehiculoDto.create(req.body);
    if (error || !vehiculoDto) {
      res.status(400).json({ message: error });
      return;
    }
    try {
      await this.vehiculoService.create(vehiculoDto);
      res.status(201).json({ message: 'Vehiculo registrado' });
    } catch (error) {
      HandleError.throw(error, res);
    }
  };

  update = async (req: Request, res: Response) => {
    const [error, vehiculoDto] = PostVehiculoDto.create(req.body);
    if (error || !vehiculoDto) {
      res.status(400).json({ message: error });
      return;
    }
    try {
      await this.vehiculoService.update(vehiculoDto);
      res.status(200).json({ message: 'Vehiculo actualizado' });
    } catch (error) {
      HandleError.throw(error, res);
    }
  };

  delete = async (req: Request, res: Response) => {
    const { conductorId } = req.params;
    if (!conductorId) {
      res.status(400).json({ message: 'El ID del conductor es requerido' });
      return;
    }

    if (!isNaN(Number(conductorId))) {
      res.status(400).json({ message: 'El ID del conductor tiene que ser un string' });
      return;
    }

    try {
      await this.vehiculoService.delete(conductorId);
      res.status(200).json({ message: 'Vehiculo eliminado' });
    } catch (error) {
      HandleError.throw(error, res);
    }
  };
}