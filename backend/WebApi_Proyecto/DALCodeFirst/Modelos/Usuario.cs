using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace DALCodeFirst.Modelos
{
    //[Table("Usuarios")]  // Especifica el nombre de la tabla
    public class Usuario : IdentityUser
    {
        //IdentityUser ya tiene Id, UserName, Email, PasswordHash
        [Required]
        [StringLength(100, ErrorMessage = "El nombre no puede exceder los 100 caracteres.")]
        public string Nombre { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "El apellido no puede exceder los 100 caracteres.")]
        public string Apellido { get; set; }

        public DateOnly FechaDeNacimiento { get; set; }
        public string RefreshToken { get; set; }
        public DateTime RefreshTokenExpiration { get; set; }

    }
}