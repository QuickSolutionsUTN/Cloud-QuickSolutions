using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace DALCodeFirst.Modelos
{
  [Table("EmpresaCategoria")]
  public class Domicilio
  {
      [Key]
      [DatabaseGenerated(DatabaseGeneratedOption.Identity)]//Autoincremental
      public int Id { get; set; }

      [Required]
      [MaxLength(50)]
      public string Calle { get; set; }

      [Required]
      public int Numero { get; set; }

      [MaxLength(50)]
      public string? Departamento { get; set; }  // Campo opcional

      [Required]
      [MaxLength(50)]
      public string Ciudad { get; set; }

      [Required]
      [MaxLength(50)]
      public string Provincia { get; set; }

      [Required]
      [MaxLength(50)]
      public string CodigoPostal { get; set; }

      [Required]
      [MaxLength(50)]
      public string Pais { get; set; }

      [Required]  // FK requerida
      public int UsuarioId { get; set; }
      [ForeignKey("UsuarioId")]
      public Usuario Usuario { get; set; }  // Relación con Usuario
  }
}
