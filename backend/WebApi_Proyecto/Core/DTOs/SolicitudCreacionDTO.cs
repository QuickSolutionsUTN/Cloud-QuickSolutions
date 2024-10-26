using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.DTOs
{
    public class SolicitudCreacionDTO
    {
        [Required]
        public string UserEmail { get; set; }

        [Required]
        [MaxLength(250)]
        public string Descripcion { get; set; }
        
        [Required]
        public int IdTipoServicio { get; set; }

        [Required]
        public int IdCategoria { get; set; }

        [Required]
        public int IdTipoProducto { get; set; }

        /*
        [Required]
        [DataType(DataType.Date)]
        public DateTime fechaGeneracion { get; set; }*/
    }
}
