using Core.DTOs;
using DALCodeFirst;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Servicios;
using WebAPI.Validators;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SolicitudController : ControllerBase
    {
        private readonly ISolicitudServicio_Servicio _solicitudServicio;
        private readonly IValidator<SolicitudCreacionDTO> _validator;
        private readonly ILogger<SolicitudController> _logger;


        public SolicitudController(ISolicitudServicio_Servicio solicitudServicio, ILogger<SolicitudController> logger, IValidator<SolicitudCreacionDTO> validator)
        {
            _solicitudServicio = solicitudServicio;
            _logger = logger;
            _validator= validator;
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
        
        [HttpPut("actualizar-estado")]
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

    }


}