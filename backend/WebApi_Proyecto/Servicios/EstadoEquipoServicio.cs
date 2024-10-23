using Core.DTOs;
using DALCodeFirst;
using DALCodeFirst.Modelos;
using Microsoft.EntityFrameworkCore;



namespace Servicios
{
    public class EstadoEquipoServicio : IEstadoEquipoServicio
    {
        private readonly WebAPIContext _context;

        public EstadoEquipoServicio(WebAPIContext context)
        {
            _context = context;
        }

        public async Task<EstadoEquipoOutDTO> CrearEstadoEquipoAsync(EstadoEquipoInDTO equipoEstadoInDTO)
        {
            var estadoEquipo = new EstadoEquipo { Descripcion = equipoEstadoInDTO.Descripcion };

            await _context.EstadoEquipo.AddAsync(estadoEquipo);
            await _context.SaveChangesAsync();

            var estadoEquipoOutDTO = new EstadoEquipoOutDTO
            {
                Id = estadoEquipo.Id,
                Descripcion = estadoEquipo.Descripcion
            };

            return estadoEquipoOutDTO;
        }

        public async Task<List<EstadoEquipoOutDTO>> ObtenerEstadosEquipoAsync()
        {
            var equipoEstados = await _context.EstadoEquipo.ToListAsync();

            var equipoEstadosOutDTO = equipoEstados.Select(e => new EstadoEquipoOutDTO
            {
                Id = e.Id,
                Descripcion = e.Descripcion
            }).ToList();

            return equipoEstadosOutDTO;
        }




    }
}
