using Core.DTOs;
using DALCodeFirst;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Servicios;
using WebAPI.Validators;
using System.Threading.Tasks;

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

        [HttpPost]//Crear un equipo
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

    }


}