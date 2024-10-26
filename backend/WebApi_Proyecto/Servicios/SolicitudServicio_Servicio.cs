using AutoMapper;
using Core.DTOs;
using DALCodeFirst;
using DALCodeFirst.Modelos;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Servicios
{
    public class SolicitudServicio_Servicio : ISolicitudServicio
    {
        private readonly WebAPIContext _context;
        private readonly UserManager<Usuario> _userManager;
        private readonly IMapper _mapper;
        public SolicitudServicio_Servicio(WebAPIContext context, UserManager<Usuario> userManager, IMapper mapper)
        {
            _context = context;
            _userManager = userManager;
            _mapper = mapper;
        }

        public async Task<SolicitudRespuestaDTO> CrearSolicitudAsync(SolicitudCreacionDTO solicitudCreacionDTO)
        {
            var user = await _userManager.FindByEmailAsync(solicitudCreacionDTO.UserEmail);
            var userId = user?.Id;

            /*if (userId == null)
            {
                return false; // or handle the error as needed
            }*/

            var nuevaSolicitud = new SolicitudServicio
            {
                Descripcion = solicitudCreacionDTO.Descripcion,
                IdSolicitante=userId,
                IdTipoServicio= solicitudCreacionDTO.IdTipoServicio,
                IdCategoriaProducto= solicitudCreacionDTO.IdCategoria,
                IdTipoProducto= solicitudCreacionDTO.IdTipoProducto,
                FechaGeneracion=DateTime.Now,
                IdSolicitudServicioEstado=1,
                ReparacionLocal=true,
            };
            
            _context.SolicitudServicio.Add(nuevaSolicitud);
            await _context.SaveChangesAsync();
            return _mapper.Map<SolicitudRespuestaDTO>(nuevaSolicitud);
        }
            
    }
}
