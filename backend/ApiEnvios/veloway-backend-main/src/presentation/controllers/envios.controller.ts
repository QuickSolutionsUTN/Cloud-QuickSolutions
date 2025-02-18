import { type Request, type Response } from 'express';
import { GetEnvioDto } from '../../application/dtos/envio/getEnvio.dto';
import { PostEnvioDto } from '../../application/dtos/envio/postEnvio.dto';
import { HandleError } from '../errors/handle.error';
import { EnviosService } from '../../application/services/envios.service';
import { UpdateEnvioDto } from '../../application/dtos/envio/udpateEnvio.dto';
import { Injectable } from '../../infrastructure/dependencies/injectable.dependency';

@Injectable()
export class EnviosController {
  constructor(
    private readonly enviosService: EnviosService
  ) {}

  getAll = async (_req: Request, res: Response) => {
    try {
      const envios = await this.enviosService.getAll();
      const enviosDto = envios.map((envio) => GetEnvioDto.create(envio));
      res.status(200).json(enviosDto);
    } catch (error) {
      HandleError.throw(error, res);
    }
  };

  getAllByClienteId = async (req: Request, res: Response) => {
    const { clienteID } = req.params;
    const { limit, offset, page } = req.query;
    const { estado, fechaDesde, fechaHasta, hora, descripcion } = req.query;

    if (!clienteID) {
      res.status(400).json({ message: 'Cliente ID es requerido' });
      return;
    }

    if ((limit && isNaN(Number(limit))) || (offset && isNaN(Number(offset))) || (page && isNaN(Number(page)))) {
      res.status(400).json({ message: 'Limit, offset y page tienen que ser números' });
      return;
    }

    if (Number(limit) < 0 || Number(offset) < 0 || Number(page) < 0) {
      res.status(400).json({ message: 'Limit, offset y page tienen que ser mayores a 0' });
      return;
    }

    const paginationOptions = {
      limit: Number(limit),
      offset: offset ? Number(offset) : (page ? (Number(page) - 1) * Number(limit) : 0),
      page: Number(page) || 1
    };

    if (fechaDesde && typeof fechaDesde !== 'string') {
      res.status(400).json({ message: 'FechaDesde tiene que ser un string' });
      return;
    }

    if (fechaHasta && typeof fechaHasta !== 'string') {
      res.status(400).json({ message: 'FechaHasta tiene que ser un string' });
      return;
    }

    if (hora && typeof hora !== 'string') {
      res.status(400).json({ message: 'Hora tiene que ser un string' });
      return;
    }

    if (estado && isNaN(Number(estado))) {
      res.status(400).json({ message: 'Estado tiene que ser un número' });
      return;
    }

    if (descripcion && typeof descripcion !== 'string') {
      res.status(400).json({ message: 'Descripción tiene que ser un string' });
      return;
    }

    const filters = {
      estado: estado ? Number(estado) : undefined,
      fechaDesde: typeof fechaDesde === 'string' ? fechaDesde : undefined,
      fechaHasta: typeof fechaHasta === 'string' ? fechaHasta : undefined,
      hora: typeof hora === 'string' ? hora : undefined,
      descripcion: typeof descripcion === 'string' ? descripcion : undefined
    };

    try {
      const totalEnvios = await this.enviosService.totalEnviosByClienteId(clienteID, filters);
      const envios = await this.enviosService.getAllByClienteId(clienteID, paginationOptions, filters);
      if (envios.length === 0) {
        res.status(200).json({ totalEnvios, envios: [] });
        return;
      }
      const enviosDto = envios.map((envio) => GetEnvioDto.create(envio));

      const lastPage = Math.ceil(totalEnvios / paginationOptions.limit);
      if (paginationOptions.page > lastPage) {
        res.status(400).json({ message: 'Página solicitada no existe' });
        return;
      }
      const previusPage = paginationOptions.page > 1 ? paginationOptions.page - 1 : null;
      const nextPage = paginationOptions.page < lastPage ? paginationOptions.page + 1 : null;

      res.status(200).json({
        totalEnvios,
        lastPage,
        previusPage,
        nextPage,
        envios: enviosDto
      });
    } catch (error) {
      HandleError.throw(error, res);
    }
  };

  getEnvio = async (req: Request, res: Response) => {
    const { nroSeguimiento } = req.params;
    try {
      const envio = await this.enviosService.getEnvio(Number(nroSeguimiento));
      const envioDto = GetEnvioDto.create(envio);
      res.status(200).json(envioDto);
    } catch (error) {
      HandleError.throw(error, res);
    }
  };

  create = async (req: Request, res: Response) => {
    const newEnvio = req.body;
    if (!newEnvio) {
      res.status(400).json({ message: 'Request body is empty' });
      return;
    }

    const [error, postEnvioDto] = PostEnvioDto.create(newEnvio);
    if (error) {
      res.status(400).json({ message: error });
      return;
    }

    if (postEnvioDto) {
      try {
        const nroSeguimiento = await this.enviosService.create(postEnvioDto);
        res.status(201).json({ nroSeguimiento });
      } catch (error) {
        HandleError.throw(error, res);
      }
    }
  };

  update = async (req: Request, res: Response) => {
    const { nroSeguimiento } = req.params;
    const updateEnvio = req.body;
    if (!updateEnvio) {
      res.status(400).json({ message: 'Request body is empty' });
      return;
    }

    const [error, updateEnvioDto] = UpdateEnvioDto.create(updateEnvio);
    if (error) {
      res.status(400).json({ message: error });
      return;
    }

    if (updateEnvioDto) {
      try {
        const envioUpdated = await this.enviosService.update(Number(nroSeguimiento), updateEnvioDto);
        const envioDto = GetEnvioDto.create(envioUpdated);
        res.status(200).json(envioDto);
      } catch (error) {
        HandleError.throw(error, res);
      }
    }
  };

  updateEstadoEnvio = async (req: Request, res: Response) => {
    const { nroSeguimiento } = req.params;
    const { estadoEnvioID } = req.body;

    try {
      await this.enviosService.updateEstadoEnvio(Number(nroSeguimiento), Number(estadoEnvioID));
      res.status(200).json({ message: 'Estado de envío actualizado' });
    } catch (error) {
      HandleError.throw(error, res);
    }
  };

  cancelarEnvio = async (req: Request, res: Response) => {
    const { nroSeguimiento } = req.params;
    try {
      await this.enviosService.cancelarEnvio(Number(nroSeguimiento));
      res.status(200).json({ message: 'Envío cancelado' });
    } catch (error) {
      HandleError.throw(error, res);
    }
  };
}
