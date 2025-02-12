using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.DTOs
{
    public class MantenimientoActualizarDTO
    {
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public List<TareaMantenimientoDTO> Checklist { get; set; }
    }
}
