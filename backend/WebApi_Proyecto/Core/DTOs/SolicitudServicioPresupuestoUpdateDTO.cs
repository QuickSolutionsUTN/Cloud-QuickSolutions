using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Core.DTOs
{
    public class SolicitudServicioPresupuestoUpdateDTO
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public int IdSolicitudServicioEstado { get; set; }

        [Required]
        public string? DiagnosticoTecnico { get; set; }

        [Required]
        public float Monto { get; set; }

        [Required]
        public DateTime FechaEstimada { get; set; }
    }
}
