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
    public class EquipoController : ControllerBase
    {
        private readonly IEquipoServicio _equipoServicio;
        private readonly IValidator<EquipoInDTO> _validator;
        private readonly ILogger<EquipoController> _logger;


        public EquipoController(IEquipoServicio equipoServicio, ILogger<EquipoController> logger, IValidator<EquipoInDTO> validator)
        {
            _equipoServicio = equipoServicio;
            _logger = logger;
            _validator= validator;
        }

        [HttpPost]//Crear un equipo
        public async Task<IActionResult> CrearEquipo([FromBody] EquipoInDTO equipoDTOIn)
        {
        
            var validationResult = await _validator.ValidateAsync(equipoDTOIn);

            if (!validationResult.IsValid)
            {
                _logger.LogError("Model state is invalid: {ModelErrors}", validationResult.Errors);
                return BadRequest(validationResult.Errors);
            }

            var nuevoEquipo = await _equipoServicio.CrearEquipoAsync(equipoDTOIn);
            return CreatedAtAction(nameof(CrearEquipo), nuevoEquipo);
        }

        
        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerEquipoPorId(int id)
        {
            var equipoDTOOut = await _equipoServicio.ObtenerEquipoPorIdAsync(id);
            if (equipoDTOOut == null)
            {
                return NotFound();
            }
            return Ok(equipoDTOOut);

        }

    }


}