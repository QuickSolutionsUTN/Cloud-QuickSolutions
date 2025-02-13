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

        public string? Descripcion { get; set; }

        [Required]  // FK
        public string IdSolicitante { get; set; }

        [ForeignKey("IdSolicitante")]
        public Usuario Solicitante { get; set; }

        [Required]  // FK
        public int IdTipoServicio { get; set; }

        [ForeignKey("IdTipoServicio")]
        public TipoServicio TipoServicio { get; set; }

        [Required]  // FK
        public int IdTipoProducto { get; set; }

        [ForeignKey("IdTipoProducto")]
        public TipoProducto TipoProducto { get; set; }

        public int? IdTipoMantenimiento { get; set; }

        [ForeignKey("IdTipoMantenimiento")]
        public TipoMantenimiento TipoMantenimiento { get; set; }

        [Required]
        public DateTime FechaGeneracion { get; set; }  // Mapea a una columna de tipo DATE en la BD

        [Required]  // FK
        public int IdSolicitudServicioEstado { get; set; }

        [ForeignKey("IdSolicitudServicioEstado")]
        public SolicitudServicioEstado SolicitudServicioEstado { get; set; }

        public string? IdTecnicoAsignado { get; set; }// FK not required

        [ForeignKey("IdTecnicoAsignado")]
        public Usuario TecnicoAsignado { get; set; }

        public DateTime? FechaEstimada { get; set; }

        public float? Monto { get; set; }

        [Required]
        public bool Tercearizado { get; set; }

        [Required]
        public bool ConLogistica { get; set; }

        public DateTime? FechaAceptada { get; set; }

        public DateTime? FechaPresupuestada { get; set; }

        public string? DiagnosticoTecnico { get; set; }

        public DateTime? FechaAprobada { get; set; }

        public DateTime? FechaFinalizada { get; set; }
        
        public DateTime? FechaCancelada { get; set; }

        public string? Resumen { get; set; }
    }
}