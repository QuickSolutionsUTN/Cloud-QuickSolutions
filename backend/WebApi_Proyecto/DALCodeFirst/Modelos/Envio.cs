using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DALCodeFirst.Modelos
{
    [Table("Envio")]
    public class Envio
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required] // FK
        public int IdSolicitudServicio { get; set; }

        [ForeignKey("IdSolicitudServicio")]
        public SolicitudServicio SolicitudServicio { get; set; }

        [Required]
        [MaxLength(50)]
        public string Calle { get; set; }

        [Required]
        public int Numero { get; set; }

        public int? Piso { get; set; }  // Campo opcional
        public string? Departamento { get; set; }  // Campo opcional

        [Required]
        public int localidadID { get; set; } //para la api de envios

        public int? nroSeguimiento { get; set; } //para la api de envios

    }
}
