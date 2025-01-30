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

            CreateMap<RolDTO, Rol>();

            CreateMap<SolicitudServicio, SolicitudRespuestaDTO>()
                .ForMember(dest => dest.Estado, opt => opt.MapFrom(src => src.SolicitudServicioEstado.Descripcion))
                .ForMember(dest => dest.TipoDeProducto, opt => opt.MapFrom(src => src.TipoProducto.Descripcion))
                .ForMember(dest => dest.EmailSolicitante, opt => opt.MapFrom(src => src.Solicitante.Email))
                .ForMember(dest => dest.TipoServicio, opt => opt.MapFrom(src => src.TipoServicio.Descripcion));

            CreateMap<TipoProducto, TipoProductoDTO>()
                .ForMember(dest => dest.Categoria, opt => opt.MapFrom(src => src.CategoriaProducto.Descripcion));

        }
    }
}
