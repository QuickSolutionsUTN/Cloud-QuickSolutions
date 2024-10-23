using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.DTOs
{
    public class EstadoEquipoInDTO
    {
        [Required]
        public string Descripcion { get; set; }
    }
}
