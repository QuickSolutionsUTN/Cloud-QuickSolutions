using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;

using Core.DTOs;
using DALCodeFirst.Modelos;
using Microsoft.EntityFrameworkCore;
using DALCodeFirst;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Servicios
{
    public class AutenticacionServicio : IAutenticacionServicio
    {
        private readonly UserManager<Usuario> _userManager;

        private readonly string _secretKey;


        public AutenticacionServicio(UserManager<Usuario> userManager, string secretKey)
        {
            _userManager = userManager;
            _secretKey = secretKey;
        }

        public async Task<string> LoginAsync(string email, string password)
        {
            try
            {
                // Buscamos el usuario por email
                var usuario = await _userManager.FindByEmailAsync(email);

                // Si no existe, lanzamos una excepción
                if (usuario == null)
                {
                    throw new Exception("Usuario no encontrado.");
                }

                // Verificamos si la contraseña es correcta
                if (!await _userManager.CheckPasswordAsync(usuario, password))
                {
                    throw new Exception("Contraseña incorrecta.");
                }

                // Retornamos el token
                return GenerateJwtToken(usuario);
            }
            catch (Exception ex)
            {
                throw new Exception("Error inesperado al autenticar el usuario.", ex);
            }
        }

        private string GenerateJwtToken(Usuario user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role, "User") // Cambia esto según los roles del usuario
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "YourIssuer",
                audience: "YourAudience",
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
