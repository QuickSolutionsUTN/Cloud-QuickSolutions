using System.ComponentModel.DataAnnotations;

namespace Core.DTOs;
public class UsuarioDTO //DTO general de usuario 
{
    //public string Id { get; set; } // El Id del usuario, que es string en IdentityUser
    [Required]
    public string Email { get; set; }// Heredada de IdentityUser
    //public string Password { get; set; }// Heredada de IdentityUser
    [Required]
    public string Nombre { get; set; }
    [Required]
    public string Apellido { get; set; }
    [Required]
    public string Rol { get; set; } 

    //public string UserName { get; set; } // Heredada de IdentityUser
    //public List<string> Roles { get; set; }
}