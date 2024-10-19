using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace DALCodeFirst.Modelos
{
    //[Table("Roles")]  // Especifica el nombre de la tabla
    public class Rol: IdentityRole //usa el modelo de roles de Identity
    {
         
    }
}