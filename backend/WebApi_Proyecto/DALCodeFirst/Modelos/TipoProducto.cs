using DALCodeFirst.Modelos;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;


namespace DALCodeFirst.Modelos
{
    [Table("TipoProducto")]
    public class TipoProducto
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]//Autoincremental
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Descripcion { get; set; }

        [Required]  // FK requerida
        public int IdCategoriaProducto { get; set; }

        [ForeignKey("IdCategoriaProducto")]
        public CategoriaProducto CategoriaProducto { get; set; }
    }
}