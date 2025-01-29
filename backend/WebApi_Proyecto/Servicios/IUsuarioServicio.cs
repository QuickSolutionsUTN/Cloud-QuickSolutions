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
        Task<UsuarioDTO> ObtenerUsuarioPorIdAsync(string userId);
        Task<bool> CheckCredentials(string email, string password);

        //List<UsuarioDTO> ObtenerUsers();
        //void CrearUsuario(UsuarioDTO usuario);
    }
}