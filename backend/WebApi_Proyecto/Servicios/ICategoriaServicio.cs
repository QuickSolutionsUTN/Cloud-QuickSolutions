using Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Servicios
{
    public interface ICategoriaServicio
    {
        Task<CategoriaDTO> CrearCategoriaAsync(string categoriaDescripcion);
        Task<List<CategoriaDTO>> ObtenerCategoriasAsync();

    }
}
