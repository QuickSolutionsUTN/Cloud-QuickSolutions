using Core.DTOs;
using DALCodeFirst;
using DALCodeFirst.Modelos;
using Microsoft.EntityFrameworkCore;



namespace Servicios
{
    public class SolicitudEstadoServicio : ISolicitudEstadoServicio
    {
        private readonly WebAPIContext _context;

        public SolicitudEstadoServicio(WebAPIContext context)
        {
            _context = context;
        }

        public async Task<SolicitudEstadoOutDTO> CrearSolicitudEstadoAsync(SolicitudEstadoInDTO solicitudEstadoInDTO)
        {
            var solicitudEstado = new SolicitudServicioEstado { Descripcion = solicitudEstadoInDTO.Descripcion };

            await _context.SolicitudServicioEstado.AddAsync(solicitudEstado);
            await _context.SaveChangesAsync();

            var solicitudEstadoOutDTO = new SolicitudEstadoOutDTO
            {
                Id = solicitudEstado.Id,
                Descripcion = solicitudEstado.Descripcion
            };

            return solicitudEstadoOutDTO;
        }

        public async Task<List<SolicitudEstadoOutDTO>> ObtenerSolicitudEstadosAsync()
        {
            var solicitudEstados = await _context.SolicitudServicioEstado.ToListAsync();

            var solicitudEstadosOutDTO = solicitudEstados.Select(s => new SolicitudEstadoOutDTO
            {
                Id = s.Id,
                Descripcion = s.Descripcion
            }).ToList();

            return solicitudEstadosOutDTO;
        }

    }
}
