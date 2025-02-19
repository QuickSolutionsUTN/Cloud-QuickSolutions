using Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Servicios
{
    public interface IEmpresaExternaServicio
    {
        Task<EmpresaExternaOutDTO> CrearEmpresaExternaAsync(EmpresaExternaInDTO empresaExternaInDTO);
    }
}
