using Core.DTOs;

//Interfaz para definir los metodos del servicio de Usuario

namespace Servicios
{
    public interface ISolicitudServicio_Servicio
    {
        Task<SolicitudRespuestaDTO> CrearSolicitudAsync(SolicitudCreacionDTO solicitudCreacionDTO);
        Task<SolicitudRespuestaDTO> ObtenerSolicitudPorIdAsync(int id );

        Task<List<SolicitudRespuestaDTO>> ObtenerSolicitudPorUserIdAsync(string userId);
        Task<List<SolicitudRespuestaDTO>> ObtenerSolicitudesAsync();

        Task<SolicitudRespuestaDTO> ActualizarEstadoSolicitudAsync(SolicitudServicioEstadoUpdateDTO SolicitudServicioEstadoUpdateDTO);
        Task<SolicitudRespuestaDTO> CancelarSolicitudAsync(SolicitudServicioCancelarDTO solicitudServicioCancelarDTO);
        Task<SolicitudRespuestaDTO> ActualizarPresupuestoSolicitudAsync(SolicitudServicioPresupuestoUpdateDTO solicitudServicioPresupuestoUpdateDTO);
        //Task<List<UsuarioDTO>> ObtenerUsuariosAsync();
        //Task<UsuarioDTO> ObtenerUsuarioPorEmailAsync(string email);
    }
}