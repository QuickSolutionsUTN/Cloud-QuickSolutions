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
using Microsoft.Extensions.Configuration;

namespace Servicios
{
    public class AutenticacionServicio : IAutenticacionServicio
    {
        private readonly UserManager<Usuario> _userManager;
        private readonly IConfiguration _configuration; //para el framework de configuration

        //private readonly string _secretKey;

        public AutenticacionServicio(UserManager<Usuario> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        public async Task<string> ValidarUsuario(string email, string password)
        {
                // Buscamos el usuario por email
                var usuario = await _userManager.FindByEmailAsync(email);

                // Si no existe, lanzamos una excepción
                if (usuario == null || !await _userManager.CheckPasswordAsync(usuario, password))
                {
                return null;
                }

                // Si las credenciales son correctas, generar el token JWT
                var token = GenerarToken(usuario.Email);

                return token;
        }

        private string GenerarToken(string email)
        {
            // Leer clave secreta desde la configuración
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            // Crear credenciales
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            // Definir los claims (información contenida en el token)
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, email), // Usamos email como sub (subject)
                new Claim(JwtRegisteredClaimNames.Email, email), // Agregamos el claim de email
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // Identificador único del token
            };


            // Crear el token
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
