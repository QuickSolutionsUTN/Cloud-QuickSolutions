using Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Servicios
{
    public interface IMarcaServicio
    {
        Task<MarcaOutDTO> CrearMarcaAsync(MarcaInDTO marcaInDTO);
        Task<List<MarcaOutDTO>> ObtenerMarcasAsync();

    }
}
