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
    {   public int Id { get; set; }
        public string Descripcion { get; set; }
        public DateTime FechaGeneracion { get; set; }
        public string Estado { get; set; }
        public string Categoria { get; set; }
        public string TipoDeProducto { get; set; }
        public string EmailSolicitante { get; set; }
        public string TipoServicio { get; set; }
        public bool ConLogistica { get; set; }
        // Campos que se usan a partir del estado "Presupuestada"
        public string? DiagnosticoTecnico { get; set; }
        public float? Monto { get; set; }
        public string? TecnicoAsignado { get; set; }
        public DateTime? FechaEstimada { get; set; }
        public bool? Tercearizado { get; set; }
        public DateTime? FechaPresupuestada { get; set; }
        public string? Resumen { get; set; }
    }
}
