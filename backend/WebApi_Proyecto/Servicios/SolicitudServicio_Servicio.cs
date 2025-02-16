using AutoMapper;
using Core.DTOs;
using DALCodeFirst;
using DALCodeFirst.Modelos;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
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
                IdSolicitante = userId,
                IdTipoServicio = solicitudCreacionDTO.IdTipoServicio,
                IdTipoProducto = solicitudCreacionDTO.IdTipoProducto,
                FechaGeneracion = DateTime.UtcNow,
                ConLogistica = solicitudCreacionDTO.ConLogistica,
                IdSolicitudServicioEstado = 1,
                Tercearizado = false,
            };

            if (solicitudCreacionDTO.IdTipoServicio == 1) { nuevaSolicitud.Descripcion = solicitudCreacionDTO.Descripcion; }
            if (solicitudCreacionDTO.IdTipoServicio == 2) { nuevaSolicitud.IdTipoMantenimiento = solicitudCreacionDTO.IdTipoMantenimiento; }

            _context.SolicitudServicio.Add(nuevaSolicitud);

            await _context.SaveChangesAsync();

            if (solicitudCreacionDTO.Envio != null)
            {
                var nuevoEnvio = new Envio
                {
                    IdSolicitudServicio = nuevaSolicitud.Id,
                    Calle = solicitudCreacionDTO.Envio.Calle,
                    Numero = solicitudCreacionDTO.Envio.Numero,
                    Piso = solicitudCreacionDTO.Envio.Piso,
                    Departamento = solicitudCreacionDTO.Envio.Departamento,
                    localidadID = solicitudCreacionDTO.Envio.IdLocalidad,
                };
                _context.Envio.Add(nuevoEnvio);
                await _context.SaveChangesAsync();

            }
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
                .Include(env => env.Envio)
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

        public async Task<SolicitudRespuestaDTO> ActualizarEstadoSolicitudAsync(SolicitudServicioEstadoUpdateDTO solicitudServicioEstadoUpdateDTO)
        {
            var solicitud = await _context.SolicitudServicio
                .FirstOrDefaultAsync(s => s.Id == solicitudServicioEstadoUpdateDTO.Id);

            if (solicitud == null)
            {
                throw new Exception("Solicitud no encontrada");
            }

            solicitud.IdSolicitudServicioEstado = solicitudServicioEstadoUpdateDTO.IdSolicitudServicioEstado;
            await _context.SaveChangesAsync();

            var solicitudActualizada = await ObtenerSolicitudPorIdAsync(solicitud.Id);
            return solicitudActualizada;
        }

        public async Task<SolicitudRespuestaDTO> CancelarSolicitudAsync(SolicitudServicioCancelarDTO solicitudServicioCancelarDTO)
        {
            var solicitud = await _context.SolicitudServicio
                .FirstOrDefaultAsync(s => s.Id == solicitudServicioCancelarDTO.Id);

            if (solicitud == null)
            {
                throw new Exception("Solicitud no encontrada");
            }

            solicitud.IdSolicitudServicioEstado = 6; // Estado "Cancelada"
            solicitud.Resumen = solicitudServicioCancelarDTO.Resumen;
            await _context.SaveChangesAsync();

            var solicitudCancelada = await ObtenerSolicitudPorIdAsync(solicitud.Id);
            return solicitudCancelada;
        }
        public async Task<SolicitudRespuestaDTO> ActualizarPresupuestoSolicitudAsync(SolicitudServicioPresupuestoUpdateDTO solicitudServicioPresupuestoUpdateDTO)
        {
            var solicitud = await _context.SolicitudServicio
                .FirstOrDefaultAsync(s => s.Id == solicitudServicioPresupuestoUpdateDTO.Id);

            if (solicitud == null)
            {
                throw new Exception("Solicitud no encontrada");
            }

            solicitud.IdSolicitudServicioEstado = solicitudServicioPresupuestoUpdateDTO.IdSolicitudServicioEstado;
            solicitud.DiagnosticoTecnico = solicitudServicioPresupuestoUpdateDTO.DiagnosticoTecnico;
            solicitud.Monto = solicitudServicioPresupuestoUpdateDTO.Monto;
            solicitud.FechaPresupuestada = DateTime.UtcNow;
            solicitud.FechaEstimada= DateTime.SpecifyKind(solicitudServicioPresupuestoUpdateDTO.FechaEstimada, DateTimeKind.Utc); 
            await _context.SaveChangesAsync();
            var solicitudActualizada = await ObtenerSolicitudPorIdAsync(solicitud.Id);
            return solicitudActualizada;
        }
    }
}


