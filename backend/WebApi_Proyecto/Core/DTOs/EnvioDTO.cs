using System.ComponentModel.DataAnnotations;

namespace Core.DTOs
{
    public class EnvioDTO
    {
        [Required]
        public string Calle { get; set; }

        [Required]
        public int Numero { get; set; }

        /*[MaxLength(50)]
        public string? Departamento { get; set; }  // Campo opcional*/

        [Required]
        [MaxLength(50)]
        public string Ciudad { get; set; }

        [Required]
        [MaxLength(50)]
        public string Provincia { get; set; }

        [Required]
        [MaxLength(50)]
        public string CodigoPostal { get; set; }

        [Required]
        [MaxLength(50)]
        public string Pais { get; set; }


    }
}
