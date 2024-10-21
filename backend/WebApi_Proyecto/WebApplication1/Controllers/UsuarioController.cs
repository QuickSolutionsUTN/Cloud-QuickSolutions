using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Serilog;

using Core.DTOs; //libreria que contiene los DTOs
using Servicios;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Net;
using DALCodeFirst.Modelos; //libreria que contiene los servicios Categoria


//Uso del middleware para errores generales y no estar usando tantos try y catch
namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/usuarios")]
    public class UsuarioController : ControllerBase
    {

        private readonly IUsuarioServicio _usuarioServicio;
        private readonly SignInManager<Usuario> _signInManager;
        private readonly ITokenServicio _tokenServicio;
        private readonly ILogger<UsuarioController> _logger;

        public UsuarioController(IUsuarioServicio usuarioServicio, SignInManager<Usuario> signInManager, ITokenServicio tokenServicio, ILogger<UsuarioController> logger)
        {
            _usuarioServicio = usuarioServicio;
            _signInManager = signInManager;
            _tokenServicio = tokenServicio;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UsuarioLoginDTO usuarioLoginDTO)
        {
            var result = await _signInManager.PasswordSignInAsync(usuarioLoginDTO.Email, usuarioLoginDTO.Password, false, lockoutOnFailure: false);

            if (result.Succeeded)
            {
                // Obtener el usuario
                var usuarioDTO = await _usuarioServicio.ObtenerUsuarioPorEmailAsync(usuarioLoginDTO.Email);
                var token = _tokenServicio.GenerarToken(usuarioDTO);
                return Ok(new { token });
            }

            // Retornamos un mensaje de error en caso de que la autenticación falle
            _logger.LogWarning($"Intento de inicio de sesión fallido para el usuario: {usuarioLoginDTO.Email}");
            return Unauthorized(new {
                status = (int)HttpStatusCode.NotFound,
                message = "Intento de inicio de sesión inválido." 
            });
        }

        [Authorize(Roles ="admin")]
        [HttpGet] //obtener todos los usuarios
        public async Task<IActionResult> ListarUsuarios()
        {
            var usuarios = await _usuarioServicio.ObtenerUsuariosAsync();
            return Ok(usuarios); // Retorna la lista de usuarios
        }

        [Authorize(Roles = "admin")]
        [HttpGet("{email}")]
        public async Task<IActionResult> ObtenerUsuarioPorEmail(string email)
        {
            //Log.Information("Buscando usuario con email: {Email}", email);

            var usuarioDto = await _usuarioServicio.ObtenerUsuarioPorEmailAsync(email);
            if (usuarioDto == null)
            {
                Log.Warning("Usuario con email {Email} no fue encontrado", email);
                return NotFound(new
                {
                    status = (int)HttpStatusCode.NotFound,
                    message = "Usuario no encontrado"
                });
            }
                return Ok(usuarioDto);
        }

        [HttpPost]//crear un usuario
        public async Task<IActionResult> CrearUsuario([FromBody] UsuarioRegistroDTO usuarioRegistroDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // Retorna errores de validación
            }
            var usuarioCreado = await _usuarioServicio.CrearUsuarioAsync(usuarioRegistroDTO);
            return CreatedAtAction(nameof(CrearUsuario), new { email = usuarioCreado.Email }, usuarioCreado);
        }

        /*
        [HttpPut("{email}")]*/

        /*[Authorize(Roles = "admin")]
        [HttpDelete("{email}")]*/
    }
}