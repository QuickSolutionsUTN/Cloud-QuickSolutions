using Core.DTOs;
using DALCodeFirst;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Validators
{
    public class CrearEquipoValidator : AbstractValidator<EquipoInDTO>
    {
        private readonly WebAPIContext _context;

        public CrearEquipoValidator(WebAPIContext context)
        {
            _context = context;
            RuleFor(x => x.Nombre)
            .NotEmpty().WithMessage("El nombre del equipo es requerido.")
            .Length(1, 50).WithMessage("El nombre del equipo debe tener entre 1 y 50 caracteres.");

            RuleFor(x => x.Descripcion)
                .NotEmpty().WithMessage("La descripción es requerida.");

            RuleFor(x => x.IdMarca)
                .NotEmpty().WithMessage("El ID de marca es requerido.")
                .MustAsync(async (idMarca, cancellation) => await MarcaExiste(idMarca))
                .WithMessage("La marca especificada no existe.");

            RuleFor(x => x.IdEstadoEquipo)
                .NotEmpty().WithMessage("El ID de estado del equipo es requerido.")
                .MustAsync(async (IdEstadoEquipo, cancellation) => await EstadoExiste(IdEstadoEquipo))
                .WithMessage("El estado del equipo especificado no existe.");
        }

        private async Task<bool> MarcaExiste(int IdMarca)
        {
            return await _context.Marca.AnyAsync(m => m.Id == IdMarca);
        }

        private async Task<bool> EstadoExiste(int IdEstadoEquipo)
        {
            return await _context.EstadoEquipo.AnyAsync(e => e.Id == IdEstadoEquipo);
        }
    }
}
