using Core.DTOs;
using DALCodeFirst.Modelos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Servicios;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MantenimientoController : ControllerBase
    {
        private readonly IMantenimientoServicio _mantenimientoServicio;

        public MantenimientoController(IMantenimientoServicio mantenimientoServicio)
        {
            _mantenimientoServicio = mantenimientoServicio;
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<IActionResult> CrearMantenimiento([FromBody] MantenimientoInDTO mantenimientoInDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var nuevoMantenimiento = await _mantenimientoServicio.CrearMantenimientoAsync(mantenimientoInDTO);
            return CreatedAtAction(nameof(CrearMantenimiento), nuevoMantenimiento);
        }

        
        [HttpGet]
        public async Task<IActionResult> ObtenerMantenimientos()
        {
            var mantenimientos = await _mantenimientoServicio.ObtenerMantenimientosAsync();
            return Ok(mantenimientos);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarMantenimiento(int id, [FromBody] MantenimientoActualizarDTO mantenimientoActualizarDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var mantenimientoActualizado = await _mantenimientoServicio.ActualizarMantenimientoAsync(mantenimientoActualizarDTO, id);
                return Ok(mantenimientoActualizado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarMantenimiento(int id)
        {
            try
            {
                await _mantenimientoServicio.EliminarMantenimientoAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }


    }
}