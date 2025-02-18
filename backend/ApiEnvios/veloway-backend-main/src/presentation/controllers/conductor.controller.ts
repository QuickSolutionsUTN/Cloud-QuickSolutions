import { type Request, type Response } from 'express';
import { Injectable } from '../../infrastructure/dependencies/injectable.dependency';
import { HandleError } from '../errors/handle.error';
import { ConductorService } from '../../application/services/conductor.service';
import { UsuarioService } from '../../application/services/usuario.service';
import { RegisterUsuarioDto } from '../../application/dtos/usuario/registerUsuario.dto';
import { PostDomicilioDto } from '../../application/dtos/domicilio/postDomicilio.dto';
import { GetUsuarioDto } from '../../application/dtos/usuario/getUsuario.dto';
import { DomicilioService } from '../../application/services/domicilio.service';
import { GetConductorDto } from '../../application/dtos/conductor/getConductor.dto';


@Injectable()
export class ConductorController {
  constructor(
    private readonly conductorService: ConductorService,
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
        const usuario = await this.usuarioService.register(clienteDto);
        const usuarioDto = GetUsuarioDto.create(usuario);
        await this.domicilioService.create(domicilioDto, usuario.getID());
        const conductorId = await this.conductorService.register(usuario);

        res.status(201).json({ usuarioDto, domicilioDto, conductorId });
      }
    } catch (error) {
      HandleError.throw(error, res);
    }
  };

  getConductor = async (req: Request, res: Response) => {
    const { idConductor } = req.params;

    try {
      const conductor = await this.conductorService.getConductor(idConductor);

      if (!conductor) {
        res.status(404).json({ message: 'No se encontró el conductor' });
        return;
      }

      const conductorDto = GetConductorDto.create(conductor);
      res.status(200).json(conductorDto);
    } catch (error) {
      HandleError.throw(error, res);
    }
  };
}
//   login = async (req: Request, res: Response) => {
//     try {
//       const { email, password } = req.body;

//       // Verificar las credenciales
//       const loginResponse = await this.usuarioService.login(email, password);

//       if (!loginResponse) {
//         return res.status(401).json({ message: 'Credenciales inválidas' });
//       }

//       const { token, usuario } = loginResponse;


//       res.cookie('auth_token', token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'strict',
//         maxAge:  60 * 60 * 1000, // 1 hs
//       });
//       // Enviar respuesta con el token
//       res.status(200).json({ message: 'Login exitoso', usuario });
//     } catch (error) {
//       return HandleError.throw(error, res);
//     }
//   };

//   logout = (req: Request, res: Response): void=> {
//     try {
//       res.clearCookie('auth_token', {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'strict',
//         path: '/'
//       });

//        res.status(200).json({ message: 'Logout exitoso' });
//     } catch (error) {
//        res.status(500).json({ message: 'Hubo un error al cerrar sesión' });
//     }
//   };


//   requestPasswordReset = async (req: Request, res: Response) => {
//     try {
//       const { email } = req.body;
//       await this.usuarioService.requestPasswordReset(email);
//       res.status(200).json({ message: 'Correo de recuperación enviado.' });
//     } catch (error) {
//       HandleError.throw(error, res);
//     }
//   };

//    resetPassword = async (req: Request, res: Response) => {
//     try {
//       const { token, newPassword } = req.body;
//       await this.usuarioService.resetPassword(token, newPassword);
//       res.status(200).json({ message: 'Contraseña restablecida correctamente.' });
//     } catch (error) {
//       HandleError.throw(error, res);
//     }
//   };


//   getAll = async (req: Request, res: Response) => {
//     try {
//       const usuarios = await this.usuarioService.getAll();
//       const usuariosDto = usuarios.map((usuario) => UsuarioDto.create(usuario));
//       res.status(200).json(usuariosDto);
//     } catch (error) {
//       HandleError.throw(error, res);
//     }
//   }

//   getUsuarioPorId = async (req: Request, res: Response) => {
//     try {
//       const { id } = req.params;

//       // Obtener el usuario desde el servicio
//       const usuario = await this.usuarioService.getUsuarioPorId(id);

//       // Convertir a DTO
//       const usuarioDto = UsuarioDto.create(usuario);

//       // Responder al cliente
//       res.status(200).json(usuarioDto);
//     } catch (error) {
//       HandleError.throw(error, res);
//     }
//   }

//   getUsuarioPorEmail = async (req: Request, res: Response) => {
//     try {
//       const { email } = req.params;

//       // Obtener el usuario desde el servicio
//       const usuario = await this.usuarioService.getUsuarioPorEmail(email);

//       // Convertir a DTO
//       const usuarioDto = UsuarioDto.create(usuario);

//       // Responder al cliente
//       res.status(200).json(usuarioDto);
//     } catch (error) {
//       HandleError.throw(error, res);
//     }
//   }

// }
