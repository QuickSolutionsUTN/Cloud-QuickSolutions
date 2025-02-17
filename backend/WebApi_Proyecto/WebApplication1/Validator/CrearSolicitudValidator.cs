using Core.DTOs;
using DALCodeFirst;
using DALCodeFirst.Modelos;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Validators
{
    
    public class CrearSolicitudValidator : AbstractValidator<SolicitudCreacionDTO>
    {
        private readonly WebAPIContext _context;
        private readonly UserManager<Usuario> _userManager;
        public CrearSolicitudValidator(WebAPIContext context, UserManager<Usuario> userManager)
        {
            _context = context;
            _userManager = userManager;

            RuleFor(x => x.UserEmail)
                .NotEmpty().WithMessage("El email del usuario es requerido.")
                .MustAsync(async (userEmail, cancellation) => await UsuarioExiste(userEmail))
                .WithMessage("El usuario no existe.");

            RuleFor(x => x.IdTipoServicio)
                .NotEmpty().WithMessage("El ID del tipo de servicio es requerido.")
                .MustAsync(async (IdTipoServicio, cancellation) => await TipoServicioExiste(IdTipoServicio))
                .WithMessage("El tipo de servicio especificado no existe.");

            RuleFor(x => x.IdTipoProducto)
               .NotEmpty().WithMessage("El ID del tipo de producto es requerido.")
               .MustAsync(async (idTipoProducto, cancellation) => await TipoProductoExiste(idTipoProducto))
               .WithMessage("El tipo de producto especificado no existe.");
        }

        private async Task<bool> UsuarioExiste(string userEmail)
        {
            var user = await _userManager.FindByEmailAsync(userEmail);
            return user != null;
        }

        private async Task<bool> TipoServicioExiste(int idTipoServicio)
        {
            return await _context.TipoServicio.AnyAsync(t => t.Id == idTipoServicio);
        }

        private async Task<bool> CategoriaExiste(int idCategoria)
        {
            return await _context.CategoriaProducto.AnyAsync(c => c.Id == idCategoria);
        }

        private async Task<bool> TipoProductoExiste(int idTipoProducto)
        {
            return await _context.TipoProducto.AnyAsync(t => t.Id == idTipoProducto);
        }
    }
}
