using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.DTOs
{
    public class CheckListMantenimientoDTO
    {
        [Required] 
        public int IdTipoMantenimiento { get; set; }

        [Required]
        [MaxLength(150)]
        public string Tarea { get; set; }

        [Required]
        public bool Obligatorio { get; set; }
    }
}
