using Core.DTOs;

namespace Servicios;
public interface ITokenServicio
{
    string GenerarToken(UsuarioDTO usuarioDTO);
}