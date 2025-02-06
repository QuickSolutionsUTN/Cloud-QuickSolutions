using Core.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Servicios;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriaController : ControllerBase
    {
        private readonly ICategoriaServicio _categoriaServicio;

        public CategoriaController(ICategoriaServicio categoriaServicio)
        {
            _categoriaServicio = categoriaServicio;

        }
        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<IActionResult> CrearCategoria([FromBody] CategoriaCreacionDTO categoriaCreacionDTO)
        {
            /*if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }*/

            var nuevaCategoria = await _categoriaServicio.CrearCategoriaAsync(categoriaCreacionDTO.Descripcion);
            return CreatedAtAction(nameof(CrearCategoria), nuevaCategoria);
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerCategorias()
        {
            var categorias = await _categoriaServicio.ObtenerCategoriasAsync();
            return Ok(categorias); // Retorna la lista de usuarios
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarCategoria(int id, [FromBody] CategoriaModificarDTO categoriaModificarDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var resultado = await _categoriaServicio.ActualizarCategoriaAsync(id, categoriaModificarDTO);

            return Ok(resultado);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarCategoria(int id)
        {
            var resultado = await _categoriaServicio.EliminarCategoriaAsync(id);
            if (!resultado)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}
