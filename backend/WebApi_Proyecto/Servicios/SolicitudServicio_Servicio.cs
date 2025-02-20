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
        private readonly ICategoriaServicio _categoriaServicio;
        public SolicitudServicio_Servicio(WebAPIContext context, UserManager<Usuario> userManager, IMapper mapper, ICategoriaServicio categoriaServicio)
        {
            _context = context;
            _userManager = userManager;
            _mapper = mapper;
            _categoriaServicio = categoriaServicio;
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

            if (solicitud == null)
            {
                throw new Exception("Solicitud no encontrada");
            }


            var tipoProductoDTO = _mapper.Map<TipoProductoDTO>(solicitud.TipoProducto);

            var categoriaDTO = await _categoriaServicio.ObtenerCategoriaPorTipoProducto(tipoProductoDTO);

            var solicitudDTO = _mapper.Map<SolicitudRespuestaDTO>(solicitud);
            Console.WriteLine(solicitud.IdTipoServicio);
            if (solicitud.IdTipoServicio == 2)
            {
                var mantenimiento = await _context.TipoMantenimiento
                    .FirstOrDefaultAsync(m => m.Id == solicitud.IdTipoMantenimiento);

                var mantenimientoDTO = _mapper.Map<MantenimientoOutDTO>(mantenimiento);

                var tareas = await _context.CheckListMantenimiento
                    .Where(c => c.IdTipoMantenimiento == mantenimiento.Id)
                    .Select(c => new TareaMantenimientoDTO
                    {
                        Id = c.Id,
                        Descripcion = c.Tarea,
                        Obligatorio = c.Obligatorio
                    })
                    .ToListAsync();
                mantenimientoDTO.Checklist = tareas;
                solicitudDTO.Mantenimiento = mantenimientoDTO;
            }

            if (solicitud.Tercearizado)
            {
                var reparacionExterna = await _context.ReparacionExterna
                    .FirstOrDefaultAsync(re => re.IdSolicitud == solicitud.Id);

                var empresa = await _context.EmpresaExterna
                    .FirstOrDefaultAsync(e => e.Id == reparacionExterna.IdEmpresa);
                var empresaDTO= _mapper.Map<EmpresaDTO>(empresa);
                var reparacionExternaDTO = new ReparacionExternaDTO
                {
                    IdSolicitudExterna = reparacionExterna.IdSolicitudExterna,
                    Empresa =empresaDTO
                };
                solicitudDTO.ReparacionExterna = reparacionExternaDTO;
            }

            solicitudDTO.Categoria = categoriaDTO.Descripcion;

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
            if (solicitudServicioEstadoUpdateDTO.IdSolicitudServicioEstado == 3 )
            {
                solicitud.FechaPresupuestada = DateTime.UtcNow;
            }

            if (solicitudServicioEstadoUpdateDTO.IdSolicitudServicioEstado == 4)
            {
                solicitud.FechaAprobada = DateTime.UtcNow;
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
            solicitud.FechaAprobada = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var solicitudCancelada = await ObtenerSolicitudPorIdAsync(solicitud.Id);
            return solicitudCancelada;
        }

        public async Task<SolicitudRespuestaDTO> IniciarSolicitudAsync(int id)
        {
            var solicitud = await _context.SolicitudServicio
                .FirstOrDefaultAsync(s => s.Id == id);

            if (solicitud == null)
            {
                throw new Exception("Solicitud no encontrada");
            }

            solicitud.FechaIniciada = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var solicitudActualizada = await ObtenerSolicitudPorIdAsync(id);
            return solicitudActualizada;
        }

        public async Task<SolicitudRespuestaDTO> ActualizarEnvioSolicitudAsync(int id, EnvioDTO envioDTO)
        {
            var solicitud = await _context.SolicitudServicio
                .FirstOrDefaultAsync(s => s.Id == id);

            if (solicitud == null)
            {
                throw new Exception("Solicitud no encontrada");
            }

            var envio = await _context.Envio
                .FirstOrDefaultAsync(e => e.IdSolicitudServicio == id);

            if (envio == null)
            {
                /*envio = new Envio();
                _context.Envio.Add(envio);*/
                throw new Exception("Envio no asociado");
            }

            envio.nroSeguimiento = envioDTO.nroSeguimiento;

            await _context.SaveChangesAsync();

            var solicitudActualizada = await ObtenerSolicitudPorIdAsync(id);
            return solicitudActualizada;
        }

        public async Task<SolicitudRespuestaDTO> PresupuestarSolicitudAsync(SolicitudServicioPresupuestarDTO SolicitudServicioPresupuestarDTO)
        {
            var solicitud = await _context.SolicitudServicio
                .FirstOrDefaultAsync(s => s.Id == SolicitudServicioPresupuestarDTO.Id);

            if (solicitud == null)
            {
                throw new Exception("Solicitud no encontrada");
            }

            solicitud.IdSolicitudServicioEstado = SolicitudServicioPresupuestarDTO.IdSolicitudServicioEstado;
            solicitud.DiagnosticoTecnico = SolicitudServicioPresupuestarDTO.DiagnosticoTecnico;
            solicitud.Monto = SolicitudServicioPresupuestarDTO.Monto;
            solicitud.FechaRevisada = DateTime.UtcNow;
            solicitud.FechaPresupuestada = DateTime.UtcNow;
            solicitud.FechaEstimada = DateTime.SpecifyKind(SolicitudServicioPresupuestarDTO.FechaEstimada, DateTimeKind.Utc);
            await _context.SaveChangesAsync();
            var solicitudActualizada = await ObtenerSolicitudPorIdAsync(solicitud.Id);
            return solicitudActualizada;
        }

        public async Task<SolicitudRespuestaDTO> FinalizarSolicitudAsync(SolicitudServicioFinalizarDTO SolicitudServicioFinalizarDTO)
        {
            var solicitud = await _context.SolicitudServicio
                .FirstOrDefaultAsync(s => s.Id == SolicitudServicioFinalizarDTO.Id);

            if (solicitud == null)
            {
                throw new Exception("Solicitud no encontrada");
            }

            solicitud.IdSolicitudServicioEstado = SolicitudServicioFinalizarDTO.IdSolicitudServicioEstado;
            solicitud.FechaFinalizada = DateTime.UtcNow;
            solicitud.Resumen = SolicitudServicioFinalizarDTO.Resumen;
            Console.WriteLine(SolicitudServicioFinalizarDTO.Resumen);
            await _context.SaveChangesAsync();
            var solicitudActualizada = await ObtenerSolicitudPorIdAsync(solicitud.Id);
            return solicitudActualizada;
        }

        public async Task<SolicitudRespuestaDTO> SubcontratarSolicitudAsync(SolicitudServicioSubcontratarDTO solicitudServicioSubcontratarDTO)
        {
            var solicitud = await _context.SolicitudServicio
                .FirstOrDefaultAsync(s => s.Id == solicitudServicioSubcontratarDTO.Id);

            if (solicitud == null)
            {
                throw new Exception("Solicitud no encontrada");
            }

            solicitud.Tercearizado = true;
            solicitud.FechaIniciada = DateTime.UtcNow;
            solicitud.IdSolicitudServicioEstado = solicitudServicioSubcontratarDTO.IdSolicitudServicioEstado;

            _context.ReparacionExterna.Add(new ReparacionExterna
            {
                IdSolicitud = solicitud.Id,
                IdEmpresa = solicitudServicioSubcontratarDTO.IdEmpresa,
                IdSolicitudExterna = solicitudServicioSubcontratarDTO.IdSolicitudExterna
            });

            await _context.SaveChangesAsync();

            var solicitudActualizada = await ObtenerSolicitudPorIdAsync(solicitud.Id);
            return solicitudActualizada;
        }

        public async Task<bool> EliminarSolicitudAsync(int solicitudId)
        {
            var solicitud = await _context.SolicitudServicio.FindAsync(solicitudId);

            if (solicitud == null)
            {
                throw new Exception("Solicitud no encontrada");
            }

            _context.SolicitudServicio.Remove(solicitud);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}


