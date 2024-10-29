using Core.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Servicios;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TipoProductoController : ControllerBase
    {
        private readonly ITipoProductoServicio _tipoProductoServicio;

        public TipoProductoController(ITipoProductoServicio tipoProductoServicio)
        {
            _tipoProductoServicio = tipoProductoServicio;

        }


        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<IActionResult> CrearTipoProducto([FromBody] TipoProductoCrearDTO tipoProductoCrearDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var nuevoTipoProducto = await _tipoProductoServicio.CrearTipoProductoAsync(tipoProductoCrearDTO);
            return CreatedAtAction(nameof(CrearTipoProducto), nuevoTipoProducto);
        }

        
        [HttpGet]
        public async Task<IActionResult> ObtenerTiposProducto()
        {
            var tiposProducto = await _tipoProductoServicio.ObtenerTiposProductoAsync();
            return Ok(tiposProducto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerTiposProductoPorCategoria(int id)
        {
            var tiposProducto = await _tipoProductoServicio.ObtenerTiposProductoPorCategoriaAsync(id);
            return Ok(tiposProducto);
        }

    }
}