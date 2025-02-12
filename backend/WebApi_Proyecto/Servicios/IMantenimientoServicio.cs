using Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Servicios
{
    public interface IMantenimientoServicio
    {
        Task<MantenimientoOutDTO> CrearMantenimientoAsync(MantenimientoInDTO mantenimientoInDTO);
        Task<List<MantenimientoOutDTO>> ObtenerMantenimientosAsync();
        Task<MantenimientoOutDTO> ActualizarMantenimientoAsync(MantenimientoActualizarDTO mantenimientoActualizarDTO, int id);

        Task<bool> EliminarMantenimientoAsync(int id);
    }
}
