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

        public string? Descripcion { get; set; }
        
        [Required]
        public int IdTipoServicio { get; set; }

        public int? IdTipoMantenimiento { get; set; }

        [Required]
        public int IdCategoria { get; set; }

        [Required]
        public int IdTipoProducto { get; set; }

        [Required]
        public bool ConLogistica { get; set; }

        public EnvioDTO? Envio { get; set; }
    }
}
