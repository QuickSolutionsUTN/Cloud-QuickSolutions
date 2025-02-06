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

        [Authorize(Roles = "admin")]
        [HttpGet("{email}")]
        public async Task<IActionResult> ObtenerUsuarioPorEmail(string email)
        {
            var usuario = await _usuarioServicio.ObtenerUsuarioPorEmailAsync(email);
            if (usuario == null)
            {
                return NotFound(new { message = "Usuario no encontrado" });
            }
            return Ok(usuario);
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
                // Generar tokens
                var userToken = _tokenServicio.GenerarToken(usuarioDTO);
                var userRefreshToken = _tokenServicio.GenerarRefreshToken();
                var refreshTokenExpiration = DateTime.UtcNow.AddDays(7);

                // Guardar el Refresh Token en la base de datos
                await _usuarioServicio.GuardarRefreshToken(usuarioDTO.Id, userRefreshToken, refreshTokenExpiration);

                _logger.LogInformation($"Inicio de sesión exitoso para el usuario: {usuarioLoginDTO.Email}");

                return Ok(new
                {
                    token = userToken,
                    refreshToken = userRefreshToken
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

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDTO request)
        {
            try
            {
                var usuarioDTO = await _usuarioServicio.ValidarUsuarioPorRefreshToken(request.RefreshToken);

                if (usuarioDTO == null)
                {
                    _logger.LogWarning($"Intento de refrescar token inválido.");
                    return Unauthorized(new
                    {
                        status = "error",
                        message = "Token de actualización inválido o expirado"
                    });
                }
                // Generar nuevos tokens
                var newAccessToken = _tokenServicio.GenerarToken(usuarioDTO);

                _logger.LogInformation($"Token refrescado correctamente para el usuario: {usuarioDTO.Email}");

                return Ok(new
                {
                    token = newAccessToken,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error durante la actualización del token: {ex.Message}");
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
                return BadRequest(ModelState); // Retorna errores de validaci�n
            }
            var usuarioCreado = await _usuarioServicio.CrearUsuarioAsync(usuarioRegistroDTO);
            return CreatedAtAction(nameof(CrearUsuario), new { email = usuarioCreado.Email }, usuarioCreado);
        }

        [Authorize]
        [HttpGet("solicitudes")]
        public async Task<IActionResult> ObtenerSolicitudPorEmail()
        {
            var userId = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "No se pudo obtener el ID del usuario del token" });
            }

            var solicitudes = await _solicitudServicio.ObtenerSolicitudPorUserIdAsync(userId);
            return Ok(solicitudes);

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
        [Authorize(Roles = "admin")]
        [HttpPut("api/users/{userId}/role")]
        public async Task<IActionResult> UpdateUserRole(string userId, [FromBody] UpdateRoleRequestDTO request)
        {

            var userDTO = await _usuarioServicio.ObtenerUsuarioPorIdAsync(userId);

            if (userDTO == null)
            {
                return NotFound(new { message = "Usuario no encontrado" });
            }

            // temporal
            var validRoles = new List<string> { "admin", "user"};
            if (!validRoles.Contains(request.rol))
            {
                return BadRequest(new { message = "Rol Invalido" });
            }

            var result = await _usuarioServicio.ActualizarRolAsync(userDTO, request.rol);

            if (!result)
            {
                return StatusCode(500, new { message = "Failed to assign role" });
            }
                

            return Ok(new { message = "Role updated successfully" });
        }

    }
}