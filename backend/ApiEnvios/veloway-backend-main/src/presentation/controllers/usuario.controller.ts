import { type Request, type Response } from 'express';
import { UsuarioService } from '../../application/services/usuario.service';
import { GetUsuarioDto } from '../../application/dtos/usuario/getUsuario.dto';
import { Injectable } from '../../infrastructure/dependencies/injectable.dependency';
import { HandleError } from '../errors/handle.error';
import { RegisterUsuarioDto } from '../../application/dtos/usuario/registerUsuario.dto';
import { PostDomicilioDto } from '../../application/dtos/domicilio/postDomicilio.dto';
import { DomicilioService } from '../../application/services/domicilio.service';
import { UpdateUsuarioDto } from '../../application/dtos/usuario/updateUsuario.dto';
import { UpdateDomicilioDto } from '../../application/dtos/domicilio/updateDomicilio.dto';
import { DomicilioMapper } from '../../application/mappers/domicilio.mapper';


@Injectable()
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly domicilioService: DomicilioService
  ) { }

  register = async (req: Request, res: Response) => {
    try {
      const { domicilio, ...usuarioData } = req.body;

      // Validar los datos del usuario
      const [error, clienteDto] = RegisterUsuarioDto.create(usuarioData);
      if (error) {
        res.status(400).json({ message: error });
        return;
      }

      // Validar los datos del domicilio
      const [errorDomicilio, domicilioDto] = PostDomicilioDto.create(domicilio);
      if (errorDomicilio) {
        res.status(400).json({ message: errorDomicilio });
        return;
      }

      if (clienteDto && domicilioDto) {
        if (await this.domicilioService.existLocalidad(domicilio.localidadID)) {
          const usuario = await this.usuarioService.register(clienteDto);
          await this.domicilioService.create(domicilioDto, usuario.getID());
          res.status(201).json({ message: 'Usuario registrado correctamente' });
        }
      }
    } catch (error) {
      HandleError.throw(error, res);
    }
  };


  getAll = async (_req: Request, res: Response) => {
    try {
      const usuarios = await this.usuarioService.getAll();
      const usuariosDto = usuarios.map((usuario) => GetUsuarioDto.create(usuario));

      res.status(200).json(usuariosDto);
    } catch (error) {
      HandleError.throw(error, res);
    }
  };

  getUsuarioPorId = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const usuario = await this.usuarioService.getUsuarioPorId(id);
      const usuarioDto = GetUsuarioDto.create(usuario);

      res.status(200).json(usuarioDto);
    } catch (error) {
      HandleError.throw(error, res);
    }
  };

  getUsuarioPorEmail = async (req: Request, res: Response) => {
    try {
      const { email } = req.params;
      const usuario = await this.usuarioService.getUsuarioPorEmail(email);
      const usuarioDto = GetUsuarioDto.create(usuario);

      res.status(200).json(usuarioDto);
    } catch (error) {
      HandleError.throw(error, res);
    }
  };

  deleteAccount = async (req: Request, res: Response) => {
    try {
    // Obtén el ID del usuario desde el token de sesión
      const userId = req.user?.id; // req.user debe estar definido en un middleware de autenticación

      if (!userId) {
        res.status(400).json({ message: 'No se pudo identificar al usuario activo.' });
        return;
      }

      // Llamada al servicio para desactivar la cuenta
      await this.usuarioService.deactivateAccount(userId);

      res.status(200).json({ message: 'Cuenta desactivada exitosamente.' });
    } catch (error) {
      HandleError.throw(error, res);
    }
  };

  regenerateApiKey = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ message: 'La cuenta no existe' });
        return;
      }
      const userId = req.user?.id; // Asumiendo que tienes el ID del usuario en req.user
      const newApiKey = await this.usuarioService.regenerateApiKeyService(userId);

      res.json({ apiKey: newApiKey });
    } catch (error) {
      HandleError.throw(error, res);
    }
  };


  modificarUsuario = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id; // Suponiendo que el id del usuario se pasa en req.user

    if (!userId) {
      res.status(400).json({ message: 'ID de usuario es requerido' });
      return;
    }

    const data = req.body; // Los datos para actualizar se pasan en el cuerpo de la solicitud

    const userData = UpdateUsuarioDto.update(data);

    console.log(userData);

    try {
      await this.usuarioService.modificarUsuario(userId, userData);
      res.status(200).json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
      HandleError.throw(error, res);
    }
  };


  modificarDomicilio = async (req: Request, res: Response): Promise<void> => {
    const id = req.user?.id; // ID del usuario

    // Verificamos si el id es undefined
    if (!id) {
      res.status(400).json({ message: 'ID de usuario es requerido' });
      return;
    }

    const domicilioData = req.body; // Obtenemos el nuevo domicilio desde el cuerpo de la solicitud

    const domicilioValidation = UpdateDomicilioDto.update(domicilioData); // Validamos la data entry

    const domicilio = await this.domicilioService.getDomicilioByUsuarioId(id); // obtenemos el domicilio objeto

    const domicilioMapped = DomicilioMapper.fromUpdateDtoToEntity(domicilioValidation, domicilio); // Mapeamos a partir del objeto y de la validacion
    try {
      const domicilioId = domicilio.getID();
      await this.domicilioService.modificarDomicilio(domicilioId, domicilioMapped);
      res.status(200).json({ message: 'Domicilio actualizado correctamente' });
    } catch (error) {
      HandleError.throw(error, res);
    }
  };
}



