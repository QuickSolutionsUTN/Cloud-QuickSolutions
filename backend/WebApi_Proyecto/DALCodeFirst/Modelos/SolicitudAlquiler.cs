using DALCodeFirst.Modelos;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DALCodeFirst.Modelos
{
    [Table("SolicitudAlquiler")]
    public class SolicitudAlquiler
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]//Autoincremental
        public int Id { get; set; }

        [ForeignKey("IdUsuario")]
        public Usuario Usuario { get; set; }

        [Required]  // FK
        public string IdUsuario { get; set; }

        [ForeignKey("IdEquipo")]
        public Equipo Equipo { get; set; }

        [Required]  // FK
        public int IdEquipo { get; set; }

        [Required]
        [Column(TypeName = "date")]
        public DateTime FechaGeneracion { get; set; }  // Mapea a una columna de tipo DATE en la BD

        [Column(TypeName = "date")]
        public DateTime FechaInicio { get; set; }

        [Column(TypeName = "date")]
        public DateTime FechaFin { get; set; }

        [ForeignKey("IdSolicitudAlquilerEstado")]
        public SolicitudAlquilerEstado SolicitudAlquilerEstado { get; set; }

        [Required]  // FK
        public int IdSolicitudAlquilerEstado { get; set; }
    }
}