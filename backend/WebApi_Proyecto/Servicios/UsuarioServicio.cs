using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;

using Core.DTOs;
using DALCodeFirst.Modelos;
using Microsoft.EntityFrameworkCore;
using DALCodeFirst;
using System.Data;
using Serilog;
using Microsoft.AspNetCore.Http.HttpResults;

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
                var resultado = _userManager.PasswordHasher.VerifyHashedPassword(usuario, usuario.PasswordHash, password);
                if (resultado == PasswordVerificationResult.Success)
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
                //AutoMapper para mapear entre el UsuarioDTO y el modelo Usuario
                var usuario = _mapper.Map<Usuario>(usuarioRegistroDto);

                // Crear el usuario
                var result = await _userManager.CreateAsync(usuario, usuarioRegistroDto.Password);

                // Verificar si la creación fue exitosa
                if (result.Succeeded)
                {
                    // Asignar el rol "user" al nuevo usuario
                    await _userManager.AddToRoleAsync(usuario, "user");
                    return _mapper.Map<UsuarioDTO>(usuario);// Devuelves el DTO
                }
                else
                {
                    // Si hubo errores, lanzar una excepción con los mensajes
                    throw new Exception("Error al crear el usuario: " + string.Join(", ", result.Errors.Select(e => e.Description)));
                }

                // Retornar el DTO del usuario creado


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
            var usuarios = await _context.Users.ToListAsync(); // Obtiene la lista de usuarios
            var usuarioDtos = new List<UsuarioDTO>();

            foreach (var usuario in usuarios)
            {
                var roles = await _userManager.GetRolesAsync(usuario); // Obtiene los roles del usuario
                var usuarioDto = _mapper.Map<UsuarioDTO>(usuario); // Mapea a UsuarioDTO

                usuarioDto.Rol = roles.FirstOrDefault(); // Asigna el nombre del primer rol al DTO

                usuarioDtos.Add(usuarioDto); // Mapea a UsuarioDTO
            }
            return usuarioDtos;// Devuelve la lista de DTOs
        }

        public async Task<UsuarioDTO> ObtenerUsuarioPorEmailAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                // En lugar de lanzar una excepción, devuelve null.
                return null;
            }
            

            var usuarioDto = _mapper.Map<UsuarioDTO>(user);

            var roles = await _userManager.GetRolesAsync(user);

            if (roles==null || roles.Count==0)
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
                // En lugar de lanzar una excepción, devuelve null.
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
    }
}