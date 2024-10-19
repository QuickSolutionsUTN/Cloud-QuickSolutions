using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Serilog;

using Core.DTOs; //libreria que contiene los DTOs
using Servicios; //libreria que contiene los servicios Categoria

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

            try
            {

                var usuarioCreado = await _usuarioServicio.CrearUsuarioAsync(usuarioRegistroDTO);
                return CreatedAtAction(nameof(CrearUsuario), new { email = usuarioCreado.Email }, usuarioCreado);

            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message }); // Manejo de excepciones
            }
        }

        [HttpGet("listar")]
        public async Task<IActionResult> ListarUsuarios()
        {
            try
            {
                var usuarios = await _usuarioServicio.ObtenerUsuariosAsync();
                return Ok(usuarios); // Retorna la lista de usuarios
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message }); // Manejo de excepciones
            }
        }

        [HttpGet("{email}")]
        public async Task<IActionResult> GetUsuarioByEmail(string email)
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