using DALCodeFirst.Modelos;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DALCodeFirst.Modelos
{
    [Table("SolicitudServicio")]
    public class SolicitudServicio
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]//Autoincremental
        public int Id { get; set; }

        [Required] 
        public string Descripcion { get; set; }

        [Required]  // FK
        public string IdSolicitante { get; set; }

        [ForeignKey("IdSolicitante")]
        public Usuario Solicitante { get; set; }

        [Required]  // FK
        public int IdTipoServicio { get; set; }

        [ForeignKey("IdTipoServicio")]
        public TipoServicio TipoServicio { get; set; }

        [Required]  // FK
        public int IdCategoriaProducto { get; set; }

        [ForeignKey("IdCategoriaProducto")]
        public CategoriaProducto CategoriaProducto { get; set; }

        [Required]  // FK
        public int IdTipoProducto { get; set; }

        [ForeignKey("IdTipoProducto")]
        public TipoProducto TipoProducto { get; set; }

        [Required]
        public DateTime FechaGeneracion { get; set; }  // Mapea a una columna de tipo DATE en la BD

        [Required]  // FK
        public int IdSolicitudServicioEstado { get; set; }

        [ForeignKey("IdSolicitudServicioEstado")]
        public SolicitudServicioEstado SolicitudServicioEstado { get; set; }

        public string? IdTecnicoAsignado { get; set; }// FK not required

        [ForeignKey("IdTecnicoAsignado")]
        public Usuario TecnicoAsignado { get; set; }

        [Required]  // FK
        public bool ReparacionLocal { get; set; }
    }
}