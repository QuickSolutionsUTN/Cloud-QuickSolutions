using DALCodeFirst.Modelos;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.DTOs
{
    public class MantenimientoOutDTO
    {
        public int Id { get; set; }
        public int IdTipoProducto { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public List<TareaMantenimientoDTO> Checklist { get; set; }
    }
}
