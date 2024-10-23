using Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Servicios
{
    public interface IEstadoEquipoServicio
    {
        Task<EstadoEquipoOutDTO> CrearEstadoEquipoAsync(EstadoEquipoInDTO estadoEquipoInDTO);
        Task<List<EstadoEquipoOutDTO>> ObtenerEstadosEquipoAsync();
    }
}
