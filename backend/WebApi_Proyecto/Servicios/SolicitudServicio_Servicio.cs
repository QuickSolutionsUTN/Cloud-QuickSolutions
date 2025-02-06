using AutoMapper;
using Core.DTOs;
using DALCodeFirst;
using DALCodeFirst.Modelos;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Servicios
{
    public class SolicitudServicio_Servicio : ISolicitudServicio_Servicio
    {
        private readonly WebAPIContext _context;
        private readonly UserManager<Usuario> _userManager;
        private readonly IMapper _mapper;
        public SolicitudServicio_Servicio(WebAPIContext context, UserManager<Usuario> userManager, IMapper mapper)
        {
            _context = context;
            _userManager = userManager;
            _mapper = mapper;
        }

        public async Task<SolicitudRespuestaDTO> CrearSolicitudAsync(SolicitudCreacionDTO solicitudCreacionDTO)
        {
            var user = await _userManager.FindByEmailAsync(solicitudCreacionDTO.UserEmail);
            var userId = user?.Id;

            var nuevaSolicitud = new SolicitudServicio
            {
                Descripcion = solicitudCreacionDTO.Descripcion,
                IdSolicitante = userId,
                IdTipoServicio = solicitudCreacionDTO.IdTipoServicio,
                IdTipoProducto = solicitudCreacionDTO.IdTipoProducto,
                FechaGeneracion = DateTime.UtcNow,
                ConLogistica = solicitudCreacionDTO.ConLogistica,
                IdSolicitudServicioEstado = 1,
                Tercearizado = false,
            };

            _context.SolicitudServicio.Add(nuevaSolicitud);
            await _context.SaveChangesAsync();

            var solicitudCreada = await ObtenerSolicitudPorIdAsync(nuevaSolicitud.Id);
            return solicitudCreada;
        }

        public async Task<List<SolicitudRespuestaDTO>> ObtenerSolicitudesAsync()
        {
            var solicitudes = await _context.SolicitudServicio
                .Include(e => e.SolicitudServicioEstado)
                .Include(tp => tp.TipoProducto)
                .Include(es => es.Solicitante)
                .Include(ts => ts.TipoServicio)
                .ToListAsync();

            var solicitudesDTO = _mapper.Map<List<SolicitudRespuestaDTO>>(solicitudes);

            return solicitudesDTO;
        }

        public async Task<SolicitudRespuestaDTO> ObtenerSolicitudPorIdAsync(int id)
        {
            var solicitud = await _context.SolicitudServicio
                .Include(e => e.SolicitudServicioEstado)
                .Include(tp => tp.TipoProducto)
                .Include(es => es.Solicitante)
                .Include(ts => ts.TipoServicio)
                .FirstOrDefaultAsync(s => s.Id == id);

            var solicitudDTO = _mapper.Map<SolicitudRespuestaDTO>(solicitud);

            return solicitudDTO;
        }

        public async Task<List<SolicitudRespuestaDTO>> ObtenerSolicitudPorUserIdAsync(string userId)
        {
            var solicitudes = await _context.SolicitudServicio
                .Include(e => e.SolicitudServicioEstado)
                .Include(tp => tp.TipoProducto)
                .Include(es => es.Solicitante)
                .Include(ts => ts.TipoServicio)
                .Where(es => es.Solicitante.Id == userId)
                .ToListAsync();

            var solicitudesDTO = _mapper.Map<List<SolicitudRespuestaDTO>>(solicitudes);

            return solicitudesDTO;
        }
    }
}


