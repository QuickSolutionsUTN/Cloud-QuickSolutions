using Core.DTOs;
using DALCodeFirst.Modelos;
using DALCodeFirst;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace Servicios
{
    public class TipoProductoServicio : ITipoProductoServicio
    {
        private readonly WebAPIContext _context;
        private readonly IMapper _mapper;

        public TipoProductoServicio(WebAPIContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<TipoProductoDTO> CrearTipoProductoAsync(TipoProductoCrearDTO tipoProductoCrearDTO)
        {
            var tipoProducto = new TipoProducto
            {
                Descripcion = tipoProductoCrearDTO.Descripcion,
                IdCategoriaProducto = tipoProductoCrearDTO.IdCategoria
            };

            await _context.TipoProducto.AddAsync(tipoProducto);
            await _context.SaveChangesAsync();

            var tipoProductoCreado = await _context.TipoProducto
                .FirstOrDefaultAsync(tp => tp.Id == tipoProducto.Id);

            var tipoProductoOutDTO = _mapper.Map<TipoProductoDTO>(tipoProductoCreado);

            return tipoProductoOutDTO;
        }
        

        public async Task<List<TipoProductoDTO>> ObtenerTiposProductoAsync()
        {
            var tiposProducto = await _context.TipoProducto
                .ToListAsync();

            var tiposProductoDTO = _mapper.Map<List<TipoProductoDTO>>(tiposProducto);

            return tiposProductoDTO;
        }

        public async Task<List<TipoProductoDTO>> ObtenerTiposProductoPorCategoriaAsync(int idCategoria)
        {
            var tiposProducto = await _context.TipoProducto
                .Where(tp => tp.IdCategoriaProducto == idCategoria)
                .ToListAsync();

            var tiposProductoDTO = _mapper.Map<List<TipoProductoDTO>>(tiposProducto);

            return tiposProductoDTO;
        }
        public async Task<TipoProductoDTO> ActualizarTipoProductoAsync (int id, TipoProductoModificarDTO tipoProductoModificarDTO)
        {
            var tipoProducto = await _context.TipoProducto
                .FirstOrDefaultAsync(tp => tp.Id == tipoProductoModificarDTO.Id);

            tipoProducto.Descripcion = tipoProductoModificarDTO.Descripcion;
            tipoProducto.IdCategoriaProducto = tipoProductoModificarDTO.IdCategoria;

            await _context.SaveChangesAsync();

            var tipoProductoOutDTO = _mapper.Map<TipoProductoDTO>(tipoProducto);

            return tipoProductoOutDTO;
        }
    }
}
