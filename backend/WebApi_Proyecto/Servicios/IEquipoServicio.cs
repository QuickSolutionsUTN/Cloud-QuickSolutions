using Core.DTOs;

namespace Servicios
{
    public interface IEquipoServicio
    {
        Task<EquipoDTO> CrearEquipoAsync(EquipoDTO equipoDTO);
    }
}
