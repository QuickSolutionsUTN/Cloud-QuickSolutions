using System.ComponentModel.DataAnnotations;

namespace Core.DTOs
{
    public class EnvioDTO
    {
        [Required]
        public string Calle { get; set; }

        [Required]
        public int Numero { get; set; }

        public string? Piso { get; set; }

        public string? Departamento { get; set; } 

        [Required]
        public int IdLocalidad { get; set; }


    }
}
