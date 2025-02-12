using Core.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Servicios;
using System.Threading.Tasks;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolController : ControllerBase
    {
        private readonly IRolServicio _rolServicio;

        public RolController(IRolServicio rolServicio)
        {
            _rolServicio = rolServicio;
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<IActionResult> CrearRol([FromBody] RolDTO rolDto)
        {
            if (rolDto == null)
            {
                return BadRequest("El rol no puede ser nulo.");
            }

            try
            {
                var nuevoRol = await _rolServicio.CrearRolAsync(rolDto);
                return CreatedAtAction(nameof(CrearRol), nuevoRol);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [Authorize(Roles = "admin")]
        [HttpGet]
        public async Task<IActionResult> ObtenerRoles()
        {

            var roles = await _rolServicio.ObtenerRolesAsync();
            return Ok(roles); // Retorna la lista de usuarios
        }
    }
}