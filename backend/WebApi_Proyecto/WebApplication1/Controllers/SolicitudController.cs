using Core.DTOs;
using DALCodeFirst;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Servicios;
using WebAPI.Validators;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using DALCodeFirst.Modelos;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SolicitudController : ControllerBase
    {
        private readonly ISolicitudServicio_Servicio _solicitudServicio;
        private readonly ISolicitudEstadoServicio _solicitudEstadoServicio;
        private readonly IValidator<SolicitudCreacionDTO> _validator;
        private readonly ILogger<SolicitudController> _logger;


        public SolicitudController(ISolicitudServicio_Servicio solicitudServicio, ISolicitudEstadoServicio solicitudEstadoServicio, ILogger<SolicitudController> logger, IValidator<SolicitudCreacionDTO> validator)
        {
            _solicitudServicio = solicitudServicio;
            _solicitudEstadoServicio = solicitudEstadoServicio;
            _logger = logger;
            _validator = validator;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CrearSolicitud([FromBody] SolicitudCreacionDTO solicitudCreacionDTO)
        {
            var validationResult = await _validator.ValidateAsync(solicitudCreacionDTO);

            if (!validationResult.IsValid)
            {
                _logger.LogError("Model state is invalid: {ModelErrors}", validationResult.Errors);
                return BadRequest(validationResult.Errors);
            }

            var nuevaSolicitud = await _solicitudServicio.CrearSolicitudAsync(solicitudCreacionDTO);
            return CreatedAtAction(nameof(CrearSolicitud), nuevaSolicitud);
        }

        [Authorize(Roles = "admin")]
        [HttpGet]
        public async Task<IActionResult> ObtenerSolicitudes()
        {
            var solicitudes = await _solicitudServicio.ObtenerSolicitudesAsync();
            return Ok(solicitudes);

        }

        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerSolicitudPorId(int id)
        {
            var solicitudDTO = await _solicitudServicio.ObtenerSolicitudPorIdAsync(id);
            if (solicitudDTO == null)
            {
                return NotFound();
            }
            return Ok(solicitudDTO);

        }

        [Authorize(Roles = "admin")]
        [HttpPut("estado-admin")]
        public async Task<IActionResult> ActualizarEstadoSolicitud([FromBody] SolicitudServicioEstadoUpdateDTO solicitudServicioEstadoUpdateDTO)
        {
            try
            {
                var solicitudActualizada = await _solicitudServicio.ActualizarEstadoSolicitudAsync(solicitudServicioEstadoUpdateDTO);
                return Ok(solicitudActualizada);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar el estado de la solicitud");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("cancelar")]
        public async Task<IActionResult> CancelarSolicitud([FromBody] SolicitudServicioCancelarDTO solicitudServicioCancelarDTO)
        {
            try
            {
                var solicitudCancelada = await _solicitudServicio.CancelarSolicitudAsync(solicitudServicioCancelarDTO);
                return Ok(solicitudCancelada);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al cancelar la solicitud");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize]
        [HttpPut("{solicitudId}/estado-usuario")]
        public async Task<IActionResult> ActualizarEstadoUser(int solicitudId, [FromBody] SolicitudServicioEstadoUpdateDTO solicitudServicioEstadoUpdateDTO)
        {
            try
            {

                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
                var solicitud = await _solicitudServicio.ObtenerSolicitudPorIdAsync(solicitudId);
                if (solicitud == null)
                {
                    return NotFound(new { message = "Solicitud no encontrada." });
                }

                if (solicitud.EmailSolicitante != userEmail)
                {
                    return Forbid("Esta solicitud no pertenece al usuario autenticado.");
                }

                if (solicitud.Estado != "Iniciada" && solicitud.Estado != "Presupuestada")
                {
                    return BadRequest(new { message = "La solicitud no se encuentra en un estado válido para actualizar su estado." });
                }

                var solicitudEstados = await _solicitudEstadoServicio.ObtenerSolicitudEstadosAsync();
                var estadoAprobada = solicitudEstados.FirstOrDefault(e => e.Descripcion == "Aprobada");
                var estadoRechazada = solicitudEstados.FirstOrDefault(e => e.Descripcion == "Cancelada");

                if (estadoAprobada == null || estadoRechazada == null)
                {
                    return StatusCode(500, new { message = "Error interno: No se encontraron los estados requeridos." });
                }

                if (solicitudServicioEstadoUpdateDTO.IdSolicitudServicioEstado != estadoAprobada.Id &&
                    solicitudServicioEstadoUpdateDTO.IdSolicitudServicioEstado != estadoRechazada.Id)
                {
                    return Forbid("Id para cambio de estado inválido, debe ser 'Aprobada' o 'Rechazada'.");
                }
                // Actualizar estado de la solicitud
                var solicitudActualizada = await _solicitudServicio.ActualizarEstadoSolicitudAsync(solicitudServicioEstadoUpdateDTO);
                return Ok(solicitudActualizada);
            }
            catch (Exception ex)
            {
                return Problem(detail: ex.Message, statusCode: 500, title: "Error interno del servidor");
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{solicitudId}/presupuesto")]
        public async Task<IActionResult> ActualizarPresupuestoSolicitud([FromBody] SolicitudServicioPresupuestoUpdateDTO solicitudServicioPresupuestoUpdateDTO)
        {
            try
            {
                var solicitudActualizada = await _solicitudServicio.ActualizarPresupuestoSolicitudAsync(solicitudServicioPresupuestoUpdateDTO);
                return Ok(solicitudActualizada);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

    }

}