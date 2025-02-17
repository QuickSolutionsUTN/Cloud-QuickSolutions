using AutoMapper;
using Core.DTOs;
using DALCodeFirst;
using DALCodeFirst.Modelos;
using Microsoft.EntityFrameworkCore;


namespace Servicios
{
    
    public class CategoriaServicio : ICategoriaServicio

    {

        private readonly WebAPIContext _context;
        private readonly IMapper _mapper;
        public CategoriaServicio(WebAPIContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
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

        public async Task<CategoriaDTO> ActualizarCategoriaAsync(int id, CategoriaModificarDTO categoriaModificarDTO)
        {
            var categoria = await _context.CategoriaProducto
                .FirstOrDefaultAsync(c => c.Id == categoriaModificarDTO.Id);

            categoria.Descripcion = categoriaModificarDTO.Descripcion;

            await _context.SaveChangesAsync();

            var categoriaDTO = _mapper.Map<CategoriaDTO>(categoria);

            return categoriaDTO;
        }

        public async Task<bool> EliminarCategoriaAsync(int id)
        {
            var categoria = await _context.CategoriaProducto.FindAsync(id);

            if (categoria == null)
            {
                return false;
            }

            _context.CategoriaProducto.Remove(categoria);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<CategoriaDTO> ObtenerCategoriaPorTipoProducto(TipoProductoDTO tipoProductoDTO)
        {
            var categoria = await _context.CategoriaProducto
                .FirstOrDefaultAsync(c => c.Id == tipoProductoDTO.IdCategoria);

            if (categoria == null)
            {
                return null;
            }

            var categoriaDTO = _mapper.Map<CategoriaDTO>(categoria);

            return categoriaDTO;

        }
    }
}
