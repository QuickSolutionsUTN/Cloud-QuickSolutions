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
        Task<SolicitudRespuestaDTO> IniciarSolicitudAsync(int id);
        Task<SolicitudRespuestaDTO> PresupuestarSolicitudAsync(SolicitudServicioPresupuestarDTO SolicitudServicioPresupuestarDTO);
        Task<SolicitudRespuestaDTO> ActualizarEnvioSolicitudAsync(int id, EnvioDTO envioDTO);
        Task<SolicitudRespuestaDTO> FinalizarSolicitudAsync(SolicitudServicioFinalizarDTO SolicitudServicioFinalizarDTO);

        //Task<List<UsuarioDTO>> ObtenerUsuariosAsync();
        //Task<UsuarioDTO> ObtenerUsuarioPorEmailAsync(string email);
    }
}