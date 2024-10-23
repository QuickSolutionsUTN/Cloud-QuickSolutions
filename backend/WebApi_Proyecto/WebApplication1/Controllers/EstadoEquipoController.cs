using Core.DTOs;
using DALCodeFirst;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Servicios;


namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EstadoEquipoController : ControllerBase
    {
        private readonly IEstadoEquipoServicio _estadoEquipoServicio;
        //private readonly IValidator<EquipoInDTO> _validator;
        private readonly ILogger<EquipoController> _logger;


        public EstadoEquipoController(IEstadoEquipoServicio estadoEquipoServicio, ILogger<EquipoController> logger)
        {
            _estadoEquipoServicio = estadoEquipoServicio;
            _logger = logger;
        }

        
        [HttpPost]//Crear
        public async Task<IActionResult> CrearEstadoEquipo([FromBody] EstadoEquipoInDTO estadoEquipoInDTO)
        {

            if (!ModelState.IsValid)
            { 
                return BadRequest();
            }

            var nuevoEstadoEquipo = await _estadoEquipoServicio.CrearEstadoEquipoAsync(estadoEquipoInDTO);
            return CreatedAtAction(nameof(CrearEstadoEquipo), nuevoEstadoEquipo);
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerEstadosEquipo()
        {
            var estadosEquipoOut = await _estadoEquipoServicio.ObtenerEstadosEquipoAsync();

            return Ok(estadosEquipoOut);

        }

    }


}