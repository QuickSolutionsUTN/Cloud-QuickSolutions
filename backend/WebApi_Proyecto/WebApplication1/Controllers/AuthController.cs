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
    public class AutenticacionController:ControllerBase
    {
        private readonly SignInManager<Usuario> _signInManager;

        public AutenticacionController(SignInManager<Usuario> signInManager)
        {
            _signInManager = signInManager;
        }

        [HttpPost("login")]

        public async Task<IActionResult> Login([FromBody] UsuarioLoginDTO usuarioLoginDTO)
        {
            //uso del middleware para no estar usando try y catch

            var result = await _signInManager.PasswordSignInAsync(usuarioLoginDTO.Email, usuarioLoginDTO.Password, false, lockoutOnFailure: false);

            if (result.Succeeded)
            {
                // Aquí puedes generar el token JWT si es necesario
                // var token = GenerarToken(loginDto.Email);
                return Ok(new { message = "Login exitoso." });
            }

            // Retornamos un mensaje de error en caso de que la autenticación falle
            return Unauthorized(new { message = "Intento de inicio de sesión inválido." });

        }


    }
}
