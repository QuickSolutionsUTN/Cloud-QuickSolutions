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
    public class TareaMantenimientoDTO
    {
        public int Id { get; set; }
        public string Descripcion { get; set; }
        public bool Obligatorio { get; set; }
    }
}
