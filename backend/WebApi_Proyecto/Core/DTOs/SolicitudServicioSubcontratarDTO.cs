using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.DTOs
{
    public class SolicitudServicioSubcontratarDTO
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public int IdSolicitudServicioEstado { get; set; }

        [Required]
        public bool Tercearizado { get; set; }

        [Required]
        public int IdEmpresa { get; set; }
        [Required]
        public int IdSolicitudExterna { get; set; }

    }
}
