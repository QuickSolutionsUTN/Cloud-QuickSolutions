
using Microsoft.AspNetCore.Identity;
using Core.DTOs;
using DALCodeFirst.Modelos;
using Microsoft.Extensions.Configuration;
using Serilog;

namespace Servicios
{
    public class AutenticacionServicio : IAutenticacionServicio
    {
        private readonly UserManager<Usuario> _userManager;
        private readonly IConfiguration _configuration;

        public AutenticacionServicio(UserManager<Usuario> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        public async Task<string> ValidarUsuario(string email, string password)
        {/*
            var usuario = await _userManager.FindByEmailAsync(email);

            if (usuario == null || !await _userManager.CheckPasswordAsync(usuario, password))
            {
                return null;
            }

            var token = GenerarToken(usuario.Email);*/

            return null;
        }
    }
}


