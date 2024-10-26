using Core.DTOs;

//Interfaz para definir los metodos del servicio de Usuario

namespace Servicios
{
    public interface ISolicitudServicio
    {
        Task<SolicitudRespuestaDTO> CrearSolicitudAsync(SolicitudCreacionDTO solicitudCreacionDTO);
        //Task<List<UsuarioDTO>> ObtenerUsuariosAsync();
        //Task<UsuarioDTO> ObtenerUsuarioPorEmailAsync(string email);
    }
}