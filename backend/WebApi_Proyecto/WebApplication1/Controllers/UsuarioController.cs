using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Serilog;

using Core.DTOs; //libreria que contiene los DTOs
using Servicios;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using DALCodeFirst.Modelos;


//Uso del middleware para errores generales y no estar usando tantos try y catch
namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsuarioController : ControllerBase
    {

        private readonly IUsuarioServicio _usuarioServicio;
        private readonly ISolicitudServicio_Servicio _solicitudServicio;
        private readonly UserManager<Usuario> _userManager;
        private readonly ITokenServicio _tokenServicio;
        private readonly ILogger<UsuarioController> _logger;

        public UsuarioController(IUsuarioServicio usuarioServicio, UserManager<Usuario> userManager, ITokenServicio tokenServicio, ILogger<UsuarioController> logger, ISolicitudServicio_Servicio solicitudServicio)
        {
            _usuarioServicio = usuarioServicio;
            _solicitudServicio = solicitudServicio;
            _userManager = userManager;
            _tokenServicio = tokenServicio;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UsuarioLoginDTO usuarioLoginDTO)
        {
            try
            {
                // Intentar obtener el usuario por correo
                var usuarioDTO = await _usuarioServicio.ObtenerUsuarioPorEmailAsync(usuarioLoginDTO.Email);
                if (usuarioDTO == null)
                {
                    _logger.LogWarning($"Usuario no encontrado: {usuarioLoginDTO.Email}");
                    return Unauthorized(new
                    {
                        status = "error",
                        message = "Credenciales inválidas"
                    });
                }

                // Validar credenciales
                var credencialesValidas = await _usuarioServicio.CheckCredentials(usuarioLoginDTO.Email, usuarioLoginDTO.Password);
                if (!credencialesValidas)
                {
                    _logger.LogWarning($"Intento de inicio de sesión fallido para el usuario: {usuarioLoginDTO.Email}");
                    return Unauthorized(new
                    {
                        status = "error",
                        message = "Credenciales inválidas"
                    });
                }

                // Generar token JWT
                var token = _tokenServicio.GenerarToken(usuarioDTO);
                _logger.LogInformation($"Inicio de sesión exitoso para el usuario: {usuarioLoginDTO.Email}");

                return Ok(new
                {
                    token = token
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error durante el inicio de sesión: {ex.Message}");
                return StatusCode(500, new
                {
                    status = "error",
                    message = "Ocurrió un error al procesar la solicitud"
                });
            }
        }

        [Authorize(Roles = "admin")]
        [HttpGet] //obtener todos los usuarios
        public async Task<IActionResult> ListarUsuarios()
        {
            var usuarios = await _usuarioServicio.ObtenerUsuariosAsync();
            return Ok(usuarios); // Retorna la lista de usuarios
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

        [HttpGet("{userEmail}/solicitudes")]
        public async Task<IActionResult> ObtenerSolicitudPorEmail(string userEmail)
        {
            var solicitudDTO = await _solicitudServicio.ObtenerSolicitudPorEmailAsync(userEmail);
            if (solicitudDTO == null)
            {
                return NotFound();
            }
            return Ok(solicitudDTO);

        }
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "No se pudo obtener el ID del usuario del token" });
            }
            var userDTO = await _usuarioServicio.ObtenerUsuarioPorIdAsync(userId);

            if (userDTO == null)
            {
                return NotFound(new { message = "Usuario no encontrado" });
            }
            return Ok(userDTO);
        }

    }
}