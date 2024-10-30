using Core.DTOs;

//Interfaz para definir los metodos del servicio de Usuario

namespace Servicios
{
    public interface ISolicitudServicio_Servicio
    {
        Task<SolicitudRespuestaDTO> CrearSolicitudAsync(SolicitudCreacionDTO solicitudCreacionDTO);
        Task<SolicitudRespuestaDTO> ObtenerSolicitudPorIdAsync(int id );

        Task<List<SolicitudRespuestaDTO>> ObtenerSolicitudPorEmailAsync(string userEmail);
        Task<List<SolicitudRespuestaDTO>> ObtenerSolicitudesAsync();
        //Task<List<UsuarioDTO>> ObtenerUsuariosAsync();
        //Task<UsuarioDTO> ObtenerUsuarioPorEmailAsync(string email);
    }
}