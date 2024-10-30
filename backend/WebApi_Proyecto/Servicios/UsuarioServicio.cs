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

        public async Task<UsuarioDTO> CrearUsuarioAsync(UsuarioRegistroDTO usuarioRegistroDto)
        {
            try
            {
                //AutoMapper para mapear entre el UsuarioDTO y el modelo Usuario
                var usuario = _mapper.Map<Usuario>(usuarioRegistroDto);

                // Hashear la contraseña
                var passwordHasher = new PasswordHasher<Usuario>();
                usuario.PasswordHash = passwordHasher.HashPassword(usuario, usuarioRegistroDto.Password);

                // Crear el usuario
                var result = await _userManager.CreateAsync(usuario);

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
            var usuario = await _userManager.FindByEmailAsync(email);

            if (usuario == null)
            {
                // En lugar de lanzar una excepción, devuelve null.
                return null;
            }
            

            var usuarioDto = _mapper.Map<UsuarioDTO>(usuario);

  
            var roles = await _userManager.GetRolesAsync(usuario);

            if (roles==null || roles.Count==0)
            {
                return null;
            }

            usuarioDto.Rol = roles.FirstOrDefault();

            return usuarioDto;
            
        }
    }
}