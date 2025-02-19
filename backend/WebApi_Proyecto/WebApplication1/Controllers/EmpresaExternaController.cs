using Core.DTOs;
using DALCodeFirst.Modelos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Servicios;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmpresaExternaController : ControllerBase
    {
        private readonly IEmpresaExternaServicio _empresaExternaServicio;

        public EmpresaExternaController(IEmpresaExternaServicio empresaExternaServicio)
        {
            _empresaExternaServicio = empresaExternaServicio;
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<IActionResult> CrearEmpresaExterna([FromBody] EmpresaExternaInDTO empresaExternaInDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var nuevoEmpresa = await _empresaExternaServicio.CrearEmpresaExternaAsync(empresaExternaInDTO);
            return CreatedAtAction(nameof(CrearEmpresaExterna), nuevoEmpresa);
        }

        /*
        [HttpGet]
        public async Task<IActionResult> ObtenerMantenimientos()
        {
            var mantenimientos = await _mantenimientoServicio.ObtenerMantenimientosAsync();
            return Ok(mantenimientos);
        }*/



    }
}