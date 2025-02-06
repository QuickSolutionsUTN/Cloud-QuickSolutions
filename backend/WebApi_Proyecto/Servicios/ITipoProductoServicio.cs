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
        Task<List<TipoProductoDTO>> ObtenerTiposProductoPorCategoriaAsync(int idCategoria);
        Task<TipoProductoDTO> ActualizarTipoProductoAsync(int id,TipoProductoModificarDTO tipoProductoModificarDTO);
        Task<bool> EliminarTipoProductoAsync(int id);
    }
}
