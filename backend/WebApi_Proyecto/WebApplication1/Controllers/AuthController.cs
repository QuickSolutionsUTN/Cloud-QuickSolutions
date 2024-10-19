using Core.DTOs;
using DALCodeFirst.Modelos;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Servicios;
using System.Threading.Tasks;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]

    [ApiController]
    public class AuthController:ControllerBase
    {
        private readonly UserManager<Usuario> _userManager;


    }
}
