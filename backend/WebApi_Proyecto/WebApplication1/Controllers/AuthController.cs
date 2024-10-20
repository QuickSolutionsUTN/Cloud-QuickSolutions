using Core.DTOs;
using DALCodeFirst.Modelos;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Servicios;
using System.Threading.Tasks;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]

    [ApiController]
    public class AutenticacionController : ControllerBase
    {
        private readonly SignInManager<Usuario> _signInManager;
        private readonly ITokenServicio _tokenServicio;
        private readonly IUsuarioServicio _usuarioServicio;

        public AutenticacionController(SignInManager<Usuario> signInManager, ITokenServicio tokenServicio, IUsuarioServicio usuarioServicio)
        {
            _signInManager = signInManager;
            _tokenServicio = tokenServicio;
            _usuarioServicio = usuarioServicio;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UsuarioLoginDTO usuarioLoginDTO)
        {
            //uso del middleware para no estar usando try y catch
            var result = await _signInManager.PasswordSignInAsync(usuarioLoginDTO.Email, usuarioLoginDTO.Password, false, lockoutOnFailure: false);

            if (result.Succeeded)
            {
                // Obtener el usuario
                var usuarioDTO = await _usuarioServicio.ObtenerUsuarioPorEmailAsync(usuarioLoginDTO.Email);

                var jwtSettingsDTO = new JwtSettingsDTO
                {
                    SecretKey = "your_secret_key",
                    Issuer = "your_issuer",
                    Audience = "your_audience"
                };
                //token JWT
                var token = _tokenServicio.GenerarToken(usuarioDTO);
                return Ok(new { token });
            }

            // Retornamos un mensaje de error en caso de que la autenticación falle
            return Unauthorized(new { message = "Intento de inicio de sesión inválido." });
        }
    }
}
