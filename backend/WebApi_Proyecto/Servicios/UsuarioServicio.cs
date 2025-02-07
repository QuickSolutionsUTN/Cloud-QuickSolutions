using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;

using Core.DTOs;
using DALCodeFirst.Modelos;
using Microsoft.EntityFrameworkCore;
using DALCodeFirst;
using System.Data;
using Azure.Core;

namespace Servicios

{
    //clase que implementa la interfaz IUsuarioServicio
    public class UsuarioServicio : IUsuarioServicio
    {
        private readonly UserManager<Usuario> _userManager; //para manejar los usuarios de Identity

        private readonly IMapper _mapper;

        private readonly WebAPIContext _context; // Agregado para usar el DbContext

        //constructor que recibe el contexto
        public UsuarioServicio(UserManager<Usuario> userManager, IMapper mapper, WebAPIContext contex)
        {
            _mapper = mapper;
            _userManager = userManager;
            _context = contex; // Agregado para usar el DbContext

        }
        public async Task<bool> CheckCredentials(string email, string password)
        {
            try
            {
                // Buscar el usuario por correo electrónico
                var usuario = await _userManager.FindByEmailAsync(email);
                if (usuario == null)
                {
                    //_logger.LogWarning($"Usuario con email '{email}' no encontrado.");
                    return false;
                }

                // Validar la contraseña
                var resultado = await _userManager.CheckPasswordAsync(usuario, password);
                if (resultado)
                {
                    //_logger.LogInformation($"Credenciales válidas para el usuario con email '{email}'.");
                    return true;
                }

                // _logger.LogWarning($"Contraseña incorrecta para el usuario con email '{email}'.");
                return false;
            }
            catch (Exception ex)
            {
                //_logger.LogError($"Error verificando las credenciales del usuario con email '{email}': {ex.Message}");
                throw; // Lanza la excepción para que sea manejada en el controlador, si es necesario
            }
        }

        public async Task<UsuarioDTO> CrearUsuarioAsync(UsuarioRegistroDTO usuarioRegistroDto)
        {
            try
            {
                var usuario = _mapper.Map<Usuario>(usuarioRegistroDto);

                var result = await _userManager.CreateAsync(usuario, usuarioRegistroDto.Password);

                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(usuario, "user");
                    return _mapper.Map<UsuarioDTO>(usuario);
                }
                else
                {
                    throw new Exception("Error al crear el usuario: " + string.Join(", ", result.Errors.Select(e => e.Description)));
                }
            }

            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error al guardar el usuario en la base de datos.", dbEx);
            }

            catch (Exception ex)
            {

                throw new Exception($"Error inesperado al crear el usuario: {ex.Message}", ex);
            }
        }

        public async Task<List<UsuarioDTO>> ObtenerUsuariosAsync()
        {
            var usuarios = await _context.Users.ToListAsync();
            var usuarioDtos = new List<UsuarioDTO>();

            foreach (var usuario in usuarios)
            {
                var roles = await _userManager.GetRolesAsync(usuario);
                var usuarioDto = _mapper.Map<UsuarioDTO>(usuario);

                usuarioDto.Rol = roles.FirstOrDefault();

                usuarioDtos.Add(usuarioDto);
            }
            return usuarioDtos;
        }

        public async Task<UsuarioDTO> ObtenerUsuarioPorEmailAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                return null;
            }

            var usuarioDto = _mapper.Map<UsuarioDTO>(user);

            var roles = await _userManager.GetRolesAsync(user);

            if (roles == null || roles.Count == 0)
            {
                return null;
            }

            usuarioDto.Rol = roles.FirstOrDefault();

            return usuarioDto;
        }

        public async Task<UsuarioDTO> ObtenerUsuarioPorIdAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return null;
            }

            var usuarioDto = _mapper.Map<UsuarioDTO>(user);

            var roles = await _userManager.GetRolesAsync(user);

            if (roles == null || roles.Count == 0)
            {
                return null;
            }

            usuarioDto.Rol = roles.FirstOrDefault();

            return usuarioDto;
        }

        public async Task GuardarRefreshToken(string userId, string refreshToken, DateTime refreshTokenExpiration)
        {
            try
            {
                var usuario = await _userManager.FindByIdAsync(userId);
                if (usuario == null)
                {
                    throw new Exception($"Usuario con ID '{userId}' no encontrado.");
                }
                usuario.RefreshToken = refreshToken;
                usuario.RefreshTokenExpiration = refreshTokenExpiration;

                var result = await _userManager.UpdateAsync(usuario);
                if (!result.Succeeded)
                {
                    throw new Exception("Error al actualizar el token de refresco: " + string.Join(", ", result.Errors.Select(e => e.Description)));
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error inesperado al guardar el token de refresco: {ex.Message}", ex);
            }
        }
        public async Task<UsuarioDTO> ValidarUsuarioPorRefreshToken(string refreshToken)
        {
            try
            {
                var usuario =  _context.Users.FirstOrDefault(u => u.RefreshToken == refreshToken);

                if (usuario == null || usuario.RefreshTokenExpiration <= DateTime.UtcNow)
                {
                    return null;
                }
                var usuarioDto = _mapper.Map<UsuarioDTO>(usuario);

                var roles = await _userManager.GetRolesAsync(usuario);

                if (roles == null || roles.Count == 0)
                {
                    return null;
                }
                usuarioDto.Rol = roles.FirstOrDefault();

                return usuarioDto;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error inesperado al obtener el usuario por token de refresco: {ex.Message}", ex);
            }
        }


        public async Task<bool> ActualizarRolAsync(UsuarioDTO usuarioDTO, string rol)
        {
            var user = await _userManager.FindByIdAsync(usuarioDTO.Id);
            // Obtener los roles actuales del usuario
            var currentRoles = await _userManager.GetRolesAsync(user);

            // Si el usuario ya tiene el rol, no es necesario hacer nada
            if (currentRoles.Contains(rol))
            {
                return false;
            }

            // Eliminar roles anteriores si es necesario
            foreach (var role in currentRoles)
            {
                await _userManager.RemoveFromRoleAsync(user, role);
            }

            // Asignar el nuevo rol
            var result = await _userManager.AddToRoleAsync(user, rol);

            if (!result.Succeeded)
            {
                return false;
            }

            return true;
        }

        public async Task<bool> EliminaUsuarioAsync(string userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return false;
                }

                var result = await _userManager.DeleteAsync(user);
                return result.Succeeded;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error inesperado al eliminar el usuario: {ex.Message}", ex);
            }
        }
    }
}