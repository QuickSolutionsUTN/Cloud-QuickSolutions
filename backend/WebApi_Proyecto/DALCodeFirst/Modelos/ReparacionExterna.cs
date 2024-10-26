using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace DALCodeFirst.Modelos
{
    [Table("ReparacionExterna")]
    public class ReparacionExterna
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]//Autoincremental
        public int Id { get; set; }

        [Required]  // FK requerida
        public int IdSolicitud { get; set; }

        [ForeignKey("IdSolicitud")]
        public SolicitudServicio Solicitud { get; set; }

        [Required]  // FK requerida
        public int IdEmpresa { get; set; }

        [ForeignKey("IdEmpresa")]
        public EmpresaExterna Empresa { get; set; }
    }
}
