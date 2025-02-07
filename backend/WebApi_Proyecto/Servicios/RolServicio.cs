
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;

using Core.DTOs;
using DALCodeFirst;
using DALCodeFirst.Modelos;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace Servicios
{
    public class RolServicio: IRolServicio
    {
        private readonly RoleManager<Rol> _roleManager; //para manejar los roles de Identity
        private readonly IMapper _mapper;

        public RolServicio(RoleManager<Rol> roleManager, IMapper mapper)
        {
            _roleManager = roleManager;
            _mapper = mapper;
        }

        public async Task<RolDTO> CrearRolAsync(RolDTO rolDto)
        {
            try
            {
                var rol = new Rol
                {
                    Name = rolDto.Descripcion
                };

                // Utilizamos RoleManager para crear el rol
                var result = await _roleManager.CreateAsync(rol);

                // Verificamos si la creación fue exitosa
                if (!result.Succeeded)
                {
                    // Si hubo errores, lanzamos una excepción con los mensajes
                    throw new Exception(string.Join(", ", result.Errors));
                }

                // Retornamos el DTO del rol creado
                return new RolDTO { Descripcion = rol.Name };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error al guardar el rol en la base de datos.", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Error inesperado al crear el rol.", ex);
            }
        }

        public async Task<List<RolDTO>> ObtenerRolesAsync()
        {
            try
            {
                // Obtenemos todos los roles
                var roles = await _roleManager.Roles.ToListAsync();

                var rolesDto = roles.Select(r => new RolDTO
                {
                    Id = r.Id,
                    Descripcion = r.Name
                }).ToList();

                return rolesDto;
            }
            catch (Exception ex)
            {
                throw new Exception("Error inesperado al obtener los roles.", ex);
            }
        }
    }
}

