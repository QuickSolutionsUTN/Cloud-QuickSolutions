using AutoMapper;
using Core.DTOs;
using DALCodeFirst.Modelos;
using DALCodeFirst;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Servicios
{
    public class TipoServicio_Servicio:ITipoServicio_Servicio
    {
        private readonly WebAPIContext _context;
        private readonly IMapper _mapper;

        public TipoServicio_Servicio(WebAPIContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<TipoServicioDTO> CrearTipoServicioAsync(TipoServicioCrearDTO tipoServicioCrearDTO)
        {
            var tipoServicio = new TipoServicio
            {
                Descripcion = tipoServicioCrearDTO.Descripcion,
            };

            await _context.TipoServicio.AddAsync(tipoServicio);
            await _context.SaveChangesAsync();

            var tipoServicioCreado = new TipoServicioDTO
            {
                Id = tipoServicio.Id,
                Descripcion = tipoServicio.Descripcion,

            };

            return tipoServicioCreado;
        }


        public async Task<List<TipoServicioDTO>> ObtenerTiposServicioAsync()
        {
            var tiposServicio = await _context.TipoServicio.ToListAsync();

            var tiposServicioDTO = tiposServicio.Select(ts => new TipoServicioDTO
            {
                Id = ts.Id,
                Descripcion = ts.Descripcion
            }).ToList();

            return tiposServicioDTO;
        }

        /*
        public async Task<List<TipoProductoDTO>> ObtenerTiposProductoPorCategoriaAsync(int idCategoria)
        {
            var tiposProducto = await _context.TipoProducto
                .Include(tp => tp.CategoriaProducto)
                .Where(tp => tp.IdCategoriaProducto == idCategoria)
                .ToListAsync();

            var tiposProductoDTO = _mapper.Map<List<TipoProductoDTO>>(tiposProducto);

            return tiposProductoDTO;
        }*/
    }
}
