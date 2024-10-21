using System.ComponentModel.DataAnnotations;


namespace Core.DTOs
{
    public class JwtSettingsDTO
    {
        [Required]
        public string SecretKey { get; set; } = string.Empty;//para asegurar que no sean null

        [Required]
        public string Issuer { get; set; } = string.Empty;

        [Required]
        public string Audience { get; set; } = string.Empty;
        [Required]
        public int TokenExpiryInMinutes { get; set; }
    }
}
