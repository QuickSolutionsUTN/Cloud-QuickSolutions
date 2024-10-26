using Core.DTOs;
using DALCodeFirst;
using DALCodeFirst.Modelos;
using Microsoft.EntityFrameworkCore;


namespace Servicios
{
    
    public class CategoriaServicio : ICategoriaServicio

    {

        private readonly WebAPIContext _context;
        public CategoriaServicio(WebAPIContext context)
        {
            _context = context;
        }

        public async Task<CategoriaDTO> CrearCategoriaAsync(string categoriaDescripcion)
        {
            var categoria = new CategoriaProducto { Descripcion = categoriaDescripcion };

            await _context.CategoriaProducto.AddAsync(categoria);
            await _context.SaveChangesAsync();

            var categoriaOutDTO = new CategoriaDTO
            {
                Id = categoria.Id,
                Descripcion = categoria.Descripcion

            };
            return categoriaOutDTO;
        }

        public async Task<List<CategoriaDTO>> ObtenerCategoriasAsync()
        {
            var categorias = await _context.CategoriaProducto.ToListAsync();

            var categoriasOutDTO = categorias.Select(c => new CategoriaDTO
            {
                Id = c.Id,
                Descripcion = c.Descripcion
            }).ToList();

            return categoriasOutDTO;
        }
    }
}
