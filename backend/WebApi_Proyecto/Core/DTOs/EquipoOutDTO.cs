using DALCodeFirst.Modelos;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.DTOs;
public class EquipoOutDTO
{
    public int Id { get; set; }

    public string Nombre { get; set; }

    public string Descripcion { get; set; }

    public int Marca { get; set; }

    public int EstadoEquipo { get; set; }

}
