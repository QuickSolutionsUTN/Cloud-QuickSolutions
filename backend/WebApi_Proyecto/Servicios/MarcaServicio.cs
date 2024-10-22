using AutoMapper;
using Core.DTOs;
using DALCodeFirst;
using DALCodeFirst.Modelos;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Servicios
{
    public class MarcaServicio : IMarcaServicio

    {
        public readonly IMapper _mapper;
        private readonly WebAPIContext _context;
        public MarcaServicio(IMapper mapper, WebAPIContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<MarcaOutDTO> CrearMarcaAsync(MarcaInDTO marcaInDTO)
        {
            var marca = new Marca { Descripcion = marcaInDTO.Descripcion };

            await _context.Marca.AddAsync(marca);
            await _context.SaveChangesAsync();

            var marcaOutDTO = new MarcaOutDTO
            {
                Id = marca.Id,
                Descripcion = marca.Descripcion

            };
            return marcaOutDTO;
        }

        public async Task<List<MarcaOutDTO>> ObtenerMarcasAsync()
        {
            var marcas = await _context.Marca.ToListAsync();

            var marcasOutDTO = marcas.Select(m => new MarcaOutDTO
            {
                Id = m.Id,
                Descripcion = m.Descripcion
            }).ToList();

            return marcasOutDTO;
        }
    }
}
