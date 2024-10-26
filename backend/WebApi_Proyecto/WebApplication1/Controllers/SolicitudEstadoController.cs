using Core.DTOs;
using DALCodeFirst;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Servicios;


namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SolicitudEstadoController : ControllerBase
    {
        private readonly ISolicitudEstadoServicio _solicitudEstadoServicio;
        //private readonly IValidator<EquipoInDTO> _validator;
        //private readonly ILogger<EquipoController> _logger;


        public SolicitudEstadoController(ISolicitudEstadoServicio solicitudEstadoServicio)
        {
            _solicitudEstadoServicio = solicitudEstadoServicio;
        }


        [Authorize(Roles = "admin")]
        [HttpPost]//Crear
        public async Task<IActionResult> CrearEstadoSolicitud([FromBody] SolicitudEstadoInDTO solicitudEstadoInDTO)
        {

            if (!ModelState.IsValid)
            { 
                return BadRequest();
            }

            var nuevoSolicitudEstado = await _solicitudEstadoServicio.CrearSolicitudEstadoAsync(solicitudEstadoInDTO);
            return CreatedAtAction(nameof(CrearEstadoSolicitud), nuevoSolicitudEstado);
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerEstadosSolicitud()
        {
            var solicitudEstadosOut = await _solicitudEstadoServicio.ObtenerSolicitudEstadosAsync();

            return Ok(solicitudEstadosOut);

        }

    }


}