using System.ComponentModel.DataAnnotations;

namespace Core.DTOs;
public class UsuarioDTO //DTO general de usuario 
{
    //public string Id { get; set; } // El Id del usuario, que es string en IdentityUser
    public string Email { get; set; }// Heredada de IdentityUser
    //public string Password { get; set; }// Heredada de IdentityUser
    public string Nombre { get; set; } 
    public string Apellido { get; set; }
    public string Rol { get; set; } 

    //public string UserName { get; set; } // Heredada de IdentityUser
    //public List<string> Roles { get; set; }
}