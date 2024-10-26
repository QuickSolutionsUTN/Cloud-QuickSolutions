using Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Servicios
{
    public interface ISolicitudEstadoServicio
    {
        Task<SolicitudEstadoOutDTO> CrearSolicitudEstadoAsync(SolicitudEstadoInDTO estadoSolicitudInDTO);
        Task<List<SolicitudEstadoOutDTO>> ObtenerSolicitudEstadosAsync();
    }
}
