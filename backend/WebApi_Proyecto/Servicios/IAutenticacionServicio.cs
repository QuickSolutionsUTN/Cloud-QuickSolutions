using Core.DTOs;



namespace Servicios
{
    public interface IAutenticacionServicio
    {
        //task para que sea asincrono
        Task<string> LoginAsync(string email, string password);
    }
}