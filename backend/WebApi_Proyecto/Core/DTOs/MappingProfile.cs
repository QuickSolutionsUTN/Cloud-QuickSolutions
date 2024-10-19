using AutoMapper;
using DALCodeFirst.Modelos;
using Microsoft.AspNetCore.Identity;

namespace Core.DTOs
{
    public class MappingProfile : Profile
    {
       

        public MappingProfile()
        {

            CreateMap<UsuarioRegistroDTO, Usuario>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email));

            CreateMap<Usuario, UsuarioDTO>();
                //.ForMember(dest => dest.Rol, opt => opt.MapFrom(src => _userManager.GetRolesAsync(src).Result.FirstOrDefault()));

            CreateMap<RolDTO, Rol>();
        }
    }
}
