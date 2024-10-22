using Core.DTOs;
using Microsoft.AspNetCore.Mvc;
using Servicios;
using System.Threading.Tasks;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EquipoController : ControllerBase
    {
        private readonly IEquipoServicio _equipoServicio;

        public EquipoController(IEquipoServicio equipoServicio)
        {
            _equipoServicio = equipoServicio;

        }

        [HttpPost]//Crear un equipo
        public async Task<IActionResult> CrearEquipo([FromBody] EquipoDTO equipoDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var nuevoEquipo = await _equipoServicio.CrearEquipoAsync(equipoDTO);
            return CreatedAtAction(nameof(CrearEquipo), nuevoEquipo);
           
        }

    }


}