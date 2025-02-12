using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;


namespace DALCodeFirst.Modelos
{
    [Table("TipoMantenimiento")]
    public class TipoMantenimiento
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]//Autoincremental
        public int Id { get; set; }

        [Required]  // FK requerida
        public int IdTipoProducto { get; set; }

        [ForeignKey("IdTipoProducto")]
        public TipoProducto TipoProducto { get; set; }

        [Required]
        [MaxLength(50)]
        public string Nombre { get; set; }

        [Required]
        [MaxLength(250)]
        public string Descripcion { get; set; }
    }
}