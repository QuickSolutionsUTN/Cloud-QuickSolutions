using Core.DTOs;

namespace Servicios
{
    public interface IEquipoServicio
    {
        Task<EquipoOutDTO> CrearEquipoAsync(EquipoInDTO equipoDTOIn);
        Task<EquipoOutDTO> ObtenerEquipoPorIdAsync(int id);
        Task<List<EquipoOutDTO>> ObtenerTodosLosEquiposAsync();
        Task<bool> ActualizarEquipoAsync(EquipoOutDTO equipoDTOOut);
        Task<bool> EliminarEquipoAsync(int id);
    }
}
