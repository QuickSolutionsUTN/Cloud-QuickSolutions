using System;
using System.ComponentModel.DataAnnotations;

namespace Core.DTOs
{
    public class SolicitudServicioCancelarDTO
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [MaxLength(250)]
        public string Resumen { get; set; }
    }
}