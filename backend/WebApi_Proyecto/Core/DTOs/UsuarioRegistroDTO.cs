using System.ComponentModel.DataAnnotations;

namespace Core.DTOs;
public class UsuarioRegistroDTO //DTO solo para crear usuario
{
    [Required]
    public string Nombre { get; set; }

    [Required]
    public string Apellido { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    public string Password { get; set; }

    [Required]
    public DateTime FechaNacimiento { get; set; }

}