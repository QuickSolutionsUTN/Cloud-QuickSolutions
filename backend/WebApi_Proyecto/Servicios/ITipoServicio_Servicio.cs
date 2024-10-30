using Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Servicios
{
    public interface ITipoServicio_Servicio
    {
        Task<TipoServicioDTO> CrearTipoServicioAsync(TipoServicioCrearDTO tipoServicioCrearDTO);
        Task<List<TipoServicioDTO>> ObtenerTiposServicioAsync();
        //Task<List<TipoServicioDTO>> ObtenerTiposProductoPorCategoriaAsync(int idCategoria);
    }
}
