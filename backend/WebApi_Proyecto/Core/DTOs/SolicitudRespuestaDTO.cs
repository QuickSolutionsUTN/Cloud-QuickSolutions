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
    }
}
