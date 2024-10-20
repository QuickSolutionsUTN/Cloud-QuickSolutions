using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Serilog;

using Core.DTOs; //libreria que contiene los DTOs
using Servicios;
using Microsoft.AspNetCore.Authorization; //libreria que contiene los servicios Categoria


//Uso del middleware para errores 500 y 404

namespace WebAPI.Controllers
{
    [ApiController] //atributo que indica que es un controlador de API
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {

        private readonly IUsuarioServicio _usuarioServicio;

        // Constructor que inyecta el servicio IProductoServicio
        public UsuarioController(IUsuarioServicio usuarioServicio)
        {
            _usuarioServicio = usuarioServicio;
        }

        [HttpPost("crear")]
        public async Task<IActionResult> CrearUsuario([FromBody] UsuarioRegistroDTO usuarioRegistroDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // Retorna errores de validación
            }

            var usuarioCreado = await _usuarioServicio.CrearUsuarioAsync(usuarioRegistroDTO);
            return CreatedAtAction(nameof(CrearUsuario), new { email = usuarioCreado.Email }, usuarioCreado);
        }

        [Authorize(Policy ="AdminOnly")]
        [HttpGet("listar")]
        public async Task<IActionResult> ListarUsuarios()
        {
            var usuarios = await _usuarioServicio.ObtenerUsuariosAsync();
            return Ok(usuarios); // Retorna la lista de usuarios
        }


        [HttpGet("{email}")]
        public async Task<IActionResult> ObtenerUsuarioPorEmail(string email)
        {
            Log.Information("Buscando usuario con email: {Email}", email);

            var usuarioDto = await _usuarioServicio.ObtenerUsuarioPorEmailAsync(email);
            if (usuarioDto == null)
            {
                Log.Warning("Usuario con email {Email} no fue encontrado", email);
                return NotFound(new { message = "Usuario no encontrado" });
            }

            return Ok(usuarioDto);
        }

    }
}