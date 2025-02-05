using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Core.DTOs;
using FluentAssertions.Common;
using System.Configuration;
using Microsoft.Extensions.Options;
using System.Security.Cryptography;

namespace Servicios
{
    public class TokenServicio : ITokenServicio
    {
        private readonly JwtSettingsDTO _jwtSettingsDTO;

        public TokenServicio(JwtSettingsDTO jwtSettings)
        {
            _jwtSettingsDTO = jwtSettings;
        }

        public string GenerarToken(UsuarioDTO usuarioDTO)
        {

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettingsDTO.SecretKey));
            // Crear credenciales
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            // Definir los claims (información contenida en el token)

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, usuarioDTO.Id),          // ID del usuario (Subject)
                new Claim(JwtRegisteredClaimNames.Email, usuarioDTO.Email),      // Email del usuario
                new Claim(ClaimTypes.Role, usuarioDTO.Rol),                      // Rol del usuario
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, usuarioDTO.Id)
            };

            var token = new JwtSecurityToken(
                issuer: _jwtSettingsDTO.Issuer,
                audience: _jwtSettingsDTO.Audience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(_jwtSettingsDTO.TokenExpiryInMinutes),
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        
        public string GenerarRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }
    
    }


}
