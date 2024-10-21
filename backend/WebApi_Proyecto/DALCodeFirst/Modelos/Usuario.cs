using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace DALCodeFirst.Modelos
{
    //[Table("Usuarios")]  // Especifica el nombre de la tabla
    public class Usuario : IdentityUser
    {

        //IdentityUser ya tiene Id, UserName, Email, PasswordHash
        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [StringLength(100, ErrorMessage = "El nombre no puede exceder los 100 caracteres.")]
        public string Nombre { get; set; }

        [Required(ErrorMessage = "El apellido es obligatorio.")]
        [StringLength(100, ErrorMessage = "El apellido no puede exceder los 100 caracteres.")]
        public string Apellido { get; set; }

        [DataType(DataType.Date)]
        public DateTime FechaDeNacimiento { get; set; }
    }
}