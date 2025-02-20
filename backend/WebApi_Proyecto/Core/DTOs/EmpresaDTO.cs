using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.DTOs
{
    public class EmpresaDTO
    {
        public string Nombre { get; set; }
        public long CUIL { get; set; }
        public int Telefono { get; set; }
        public string Email { get; set; }
    }
}
