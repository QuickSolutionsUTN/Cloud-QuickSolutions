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
    public class SolicitudRespuestaDTO
    { public int Id { get; set; }
        public string Descripcion { get; set; }
        public DateTime FechaGeneracion { get; set; }
        public string Estado { get; set; }
        public string Categoria { get; set; }
        public string TipoDeProducto { get; set; }
        public string EmailSolicitante { get; set; }
        public string TipoServicio { get; set; }
        public bool ConLogistica { get; set; }
        public EnvioDTO? Envio { get; set; }
        public bool? Tercearizado { get; set; }
        public string? TecnicoAsignado { get; set; }
        public DateTime? FechaRevisada { get; set; }
        public string? DiagnosticoTecnico { get; set; }
        public DateTime? FechaEstimada { get; set; }
        public float? Monto { get; set; }
        public DateTime? FechaIniciada { get; set; }
        public DateTime? FechaPresupuestada { get; set; }
        public DateTime? FechaAprobada { get; set; }
        public DateTime? FechaFinalizada { get; set; }
        public DateTime? FechaCancelada { get; set; }
        public string? Resumen { get; set; }

        public MantenimientoOutDTO? Mantenimiento { get; set; }
        public ReparacionExternaDTO? ReparacionExterna { get; set; } 
    }
}
