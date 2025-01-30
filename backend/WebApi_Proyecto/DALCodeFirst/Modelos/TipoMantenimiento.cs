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

        [Required]
        [MaxLength(50)]
        public string Descripcion { get; set; }
    }
}