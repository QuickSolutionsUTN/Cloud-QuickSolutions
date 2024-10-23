using System.ComponentModel.DataAnnotations;

namespace Core.DTOs;
public class UsuarioDTO //DTO general de usuario 
{
    [Required]
    public string Email { get; set; }// Heredada de IdentityUser
    [Required]
    public string Nombre { get; set; }
    [Required]
    public string Apellido { get; set; }
    [Required]
    public string Rol { get; set; } 
}