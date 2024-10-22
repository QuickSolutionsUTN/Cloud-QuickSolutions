using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;

using Core.DTOs;
using DALCodeFirst;
using DALCodeFirst.Modelos;
using Microsoft.EntityFrameworkCore;

namespace Servicios
{
    internal class EquipoServicio
    {
        private readonly WebAPIContext _context;
        private readonly IMapper _mapper;
        public EquipoServicio(WebAPIContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<EquipoDTO> CrearEquipoAsync(EquipoDTO equipoDTO)
        {
            var equipo = _mapper.Map<Equipo>(equipoDTO);
            await _context.Equipo.AddAsync(equipo);
            await _context.SaveChangesAsync();
            return _mapper.Map<EquipoDTO>(equipo);
        }

    }
}
