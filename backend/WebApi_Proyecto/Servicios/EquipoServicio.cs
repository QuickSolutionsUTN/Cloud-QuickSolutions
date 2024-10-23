using System.Threading.Tasks;
using AutoMapper;

using Core.DTOs;
using DALCodeFirst;
using DALCodeFirst.Modelos;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace Servicios
{
    public class EquipoServicio:IEquipoServicio
    {
        private readonly WebAPIContext _context;
        private readonly IMapper _mapper;
        public EquipoServicio(WebAPIContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<EquipoOutDTO> CrearEquipoAsync(EquipoInDTO equipoDTOIn)
        {
            var equipo = _mapper.Map<Equipo>(equipoDTOIn);
            await _context.Equipo.AddAsync(equipo);
            await _context.SaveChangesAsync();
            return _mapper.Map<EquipoOutDTO>(equipo);
        }

        public async Task<EquipoOutDTO> ObtenerEquipoPorIdAsync(int id)
        {
            var equipo= await _context.Equipo
                .Include(e => e.Marca)
                .Include(e => e.EstadoEquipo)
                .FirstOrDefaultAsync(e => e.Id == id);

            return _mapper.Map<EquipoOutDTO>(equipo);
        }

        public async Task<List<EquipoOutDTO>> ObtenerTodosLosEquiposAsync()
        {
            var equipos = await _context.Equipo
                                        .Include(e => e.Marca)
                                        .Include(e => e.EstadoEquipo)
                                        .ToListAsync();

            return _mapper.Map<List<EquipoOutDTO>>(equipos);
        }

        public async Task<bool> ActualizarEquipoAsync(EquipoOutDTO equipoDTOOut)
        {
            //var equipo = await _context.Equipo.FindAsync(equipoDTOOut.Id);
            //if (equipo == null)
            //{
            //    return false; 
            //}
            //// Actualiza los detalles del equipo
            //equipo.Nombre = equipoDTOOut.Nombre;
            //equipo.Descripcion = equipoDTOOut.Descripcion;
            //equipo.IdMarca = equipoDTOOut.Marca;
            //equipo.IdEstadoEquipo = equipoDTOOut.EstadoEquipo;

            //await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> EliminarEquipoAsync(int id)
        {
            var equipo = await _context.Equipo.FindAsync(id);
            if (equipo == null)
            {
                return false;
            }
            _context.Equipo.Remove(equipo);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}
