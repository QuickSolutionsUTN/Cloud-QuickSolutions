using Core.DTOs;



namespace Servicios
{
    public interface IAutenticacionServicio
    {
        //task para que sea asincrono
        Task<string> ValidarUsuario(string email, string password);
    }
}