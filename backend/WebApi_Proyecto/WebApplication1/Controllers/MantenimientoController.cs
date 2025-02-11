using Core.DTOs;
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

        /*
        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerTiposProductoPorCategoria(int id)
        {
            var tiposProducto = await _mantenimientoServicio.ObtenerTiposProductoPorCategoriaAsync(id);
            return Ok(tiposProducto);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarTipoProducto(int id, [FromBody] TipoProductoModificarDTO tipoProductoModificarDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var resultado = await _mantenimientoServicio.ActualizarTipoProductoAsync(id, tipoProductoModificarDTO);

            return Ok(resultado);
        }
        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarTipoProducto(int id)
        {
            var resultado = await _mantenimientoServicio.EliminarTipoProductoAsync(id);
            if (!resultado)
            {
                return NotFound();
            }
            return NoContent();
        }*/

    }
}