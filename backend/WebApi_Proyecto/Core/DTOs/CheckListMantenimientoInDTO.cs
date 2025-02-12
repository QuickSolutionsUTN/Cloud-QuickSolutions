using DALCodeFirst.Modelos;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.DTOs
{
    public class CheckListMantenimientoInDTO
    {

        [Required]
        [MaxLength(150)]
        public string Descripcion { get; set; }

        [Required]
        public bool Obligatorio { get; set; }
    }
}
