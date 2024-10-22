using Core.DTOs;
using Microsoft.AspNetCore.Mvc;
using Servicios;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MarcaController : ControllerBase
    {
        private readonly IMarcaServicio _marcaServicio;

        public MarcaController(IMarcaServicio marcaServicio)
        {
            _marcaServicio = marcaServicio;

        }

        [HttpPost]//Crear una marca 
        public async Task<IActionResult> CrearMarca([FromBody] MarcaInDTO marcaInDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var nuevoMarca = await _marcaServicio.CrearMarcaAsync(marcaInDTO);
            return CreatedAtAction(nameof(CrearMarca), nuevoMarca);
        }

        [HttpGet]//Crear una marca 
        public async Task<IActionResult> ObtenerMarcas()
        {
            var marcas = await _marcaServicio.ObtenerMarcasAsync();
            return Ok(marcas); // Retorna la lista de usuarios
        }
    }
}
