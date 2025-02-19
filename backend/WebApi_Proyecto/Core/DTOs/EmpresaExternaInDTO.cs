using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.DTOs
{
    public class EmpresaExternaInDTO
    {    

        [Required]
        [MaxLength(50)]
        public string Nombre { get; set; }

        [Required]
        public long CUIL { get; set; }

        [Required]
        public int Telefono { get; set; }

        [Required]
        [MaxLength(50)]
        public string Email { get; set; }
    }
}

