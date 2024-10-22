using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DALCodeFirst.Modelos
{
    [Table("Equipo")]
    public class Equipo
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]//Autoincremental
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Nombre { get; set; }

        [Required]
        [MaxLength(200)]
        public string Descripcion { get; set; }

        [Required]  // FK requerida
        public int IdMarca { get; set; }

        [ForeignKey("IdMarca")]
        public Marca Marca { get; set; }

        [Required]  // FK requerida
        public int IdEstadoEquipo { get; set; }

        [ForeignKey("IdEstadoEquipo")]
        public EstadoEquipo EstadoEquipo { get; set; }
    }
}

