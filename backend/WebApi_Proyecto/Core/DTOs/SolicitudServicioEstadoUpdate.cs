using System;
using System.ComponentModel.DataAnnotations;

namespace Core.DTOs
{
    public class SolicitudServicioEstadoUpdateDTO
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public int IdSolicitudServicioEstado { get; set; }
    }
}