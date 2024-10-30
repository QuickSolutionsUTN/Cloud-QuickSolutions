using Core.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Servicios;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TipoServicioController : ControllerBase
    {
        private readonly ITipoServicio_Servicio _tipoServicio_Servicio;

        public TipoServicioController(ITipoServicio_Servicio tipoServicio_Servicio)
        {
            _tipoServicio_Servicio = tipoServicio_Servicio;

        }


        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<IActionResult> CrearTipoServicio([FromBody] TipoServicioCrearDTO tipoServicioCrearDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var nuevoTipoServicio = await _tipoServicio_Servicio.CrearTipoServicioAsync(tipoServicioCrearDTO);
            return CreatedAtAction(nameof(CrearTipoServicio), nuevoTipoServicio);
        }


        [HttpGet]
        public async Task<IActionResult> ObtenerTiposServicio()
        {
            var tiposServicio = await _tipoServicio_Servicio.ObtenerTiposServicioAsync();
            return Ok(tiposServicio);
        }
    }
}
