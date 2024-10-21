using Core.DTOs;

//Interfaz para definir los metodos del servicio de Usuario

namespace Servicios
{
    public interface IUsuarioServicio
    {
        //task para que sea asincrono
        Task<UsuarioDTO> CrearUsuarioAsync(UsuarioRegistroDTO UsuarioRegistro);
        Task<List<UsuarioDTO>> ObtenerUsuariosAsync();
        Task<UsuarioDTO> ObtenerUsuarioPorEmailAsync(string email);

        //List<UsuarioDTO> ObtenerUsers();
        //void CrearUsuario(UsuarioDTO usuario);
    }
}