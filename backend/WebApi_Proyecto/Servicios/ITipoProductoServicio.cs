using Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Servicios
{
    public interface ITipoProductoServicio
    {
        Task<TipoProductoDTO> CrearTipoProductoAsync(TipoProductoCrearDTO tipoProductoCrearDTO);
        Task<List<TipoProductoDTO>> ObtenerTiposProductoAsync();
    }
}
