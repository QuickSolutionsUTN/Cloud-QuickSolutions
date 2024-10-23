using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DALCodeFirst.Modelos
{
    [Table("SolicitudAlquilerEstado")]
    public class SolicitudAlquilerEstado
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]//Autoincremental
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Descripcion { get; set; }
    }
}
