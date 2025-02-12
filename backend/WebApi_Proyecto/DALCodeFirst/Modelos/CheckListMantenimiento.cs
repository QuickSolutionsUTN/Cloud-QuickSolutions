using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;

namespace DALCodeFirst.Modelos
{
    [Table("CheckListMantenimiento")]
    public class CheckListMantenimiento
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]//Autoincremental
        public int Id { get; set; }

        [Required]  // FK requerida
        public int IdTipoMantenimiento { get; set; }

        [ForeignKey("IdTipoMantenimiento")]
        public TipoMantenimiento TipoMantenimiento { get; set; }

        [Required]
        [MaxLength(150)]
        public string Tarea { get; set; }

        [Required]
        public bool Obligatorio { get; set; }
    }
}
