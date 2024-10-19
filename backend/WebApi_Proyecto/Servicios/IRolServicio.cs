using Core.DTOs;

//Interfaz para definir los metodos del servicio de Usuario

namespace Servicios
{
    public interface IRolServicio
    {
        //task para que sea asincrono
        Task<RolDTO> CrearRolAsync(RolDTO rolDTO); //
    }
}