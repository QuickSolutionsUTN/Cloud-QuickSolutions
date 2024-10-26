using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DALCodeFirst.Modelos
{
    [Table("EmpresaCategoria")]
    public class EmpresaCategoria
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]//Autoincremental
        public int Id { get; set; }

        [Required]  // FK requerida
        public int IdEmpresa{ get; set; }

        [ForeignKey("IdEmpresa")]
        public EmpresaExterna Empresa { get; set; }

        [Required]  // FK requerida
        public int IdCategoria { get; set; }

        [ForeignKey("IdCategoria")]
        public CategoriaProducto Categoria { get; set; }
    }
}
