using AutoMapper;
using DALCodeFirst;
using DALCodeFirst.Modelos;
using Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Servicios
{
    public class EmpresaExternaServicio : IEmpresaExternaServicio
    {
        private readonly WebAPIContext _context;
        private readonly IMapper _mapper;
        public EmpresaExternaServicio(WebAPIContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<EmpresaExternaOutDTO> CrearEmpresaExternaAsync(EmpresaExternaInDTO empresaExternaInDTO)
        {
            var empresaExterna = _mapper.Map<EmpresaExterna>(empresaExternaInDTO);
            _context.EmpresaExterna.Add(empresaExterna);
            await _context.SaveChangesAsync();
            return _mapper.Map<EmpresaExternaOutDTO>(empresaExterna);
        }

    }
}
