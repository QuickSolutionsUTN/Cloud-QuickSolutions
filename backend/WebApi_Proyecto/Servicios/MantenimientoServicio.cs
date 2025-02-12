
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;

using Core.DTOs;
using DALCodeFirst;
using DALCodeFirst.Modelos;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace Servicios
{
    public class MantenimientoServicio:IMantenimientoServicio
    {
        private readonly WebAPIContext _context;
        private readonly IMapper _mapper;
        public MantenimientoServicio(WebAPIContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<MantenimientoOutDTO> CrearMantenimientoAsync(MantenimientoInDTO mantenimientoInDTO)
        {
            var mantenimiento = _mapper.Map<TipoMantenimiento>(mantenimientoInDTO);
            _context.TipoMantenimiento.Add(mantenimiento);
            await _context.SaveChangesAsync();
            var checkList = mantenimientoInDTO.CheckList;

            foreach (var item in checkList)
            {

                var checkListMantenimientoDTO = new CheckListMantenimientoDTO
                {
                    IdTipoMantenimiento = mantenimiento.Id,
                    Tarea = item.Descripcion,
                    Obligatorio = item.Obligatorio
                };
                var checkListMantenimiento = _mapper.Map<CheckListMantenimiento>(checkListMantenimientoDTO);
                _context.CheckListMantenimiento.Add(checkListMantenimiento);
            }

            var mantenimientoOutDTO = _mapper.Map<MantenimientoOutDTO>(mantenimiento);
            await _context.SaveChangesAsync();
            return mantenimientoOutDTO;
        }

        public async Task<List<MantenimientoOutDTO>> ObtenerMantenimientosAsync()
        {
            var mantenimientos = await _context.TipoMantenimiento
                .ToListAsync();


            var mantenimientosOutDTO = new List<MantenimientoOutDTO>();

            foreach(var mantenimiento in mantenimientos)
            {
                var tareas = await _context.CheckListMantenimiento
                    .Where(c => c.IdTipoMantenimiento == mantenimiento.Id)
                    .Select(c => new TareaMantenimientoDTO
                    {
                        Id=c.Id,
                        Descripcion = c.Tarea,
                        Obligatorio = c.Obligatorio
                    })
                    .ToListAsync();

                var mantenimientoOutDTO = new MantenimientoOutDTO
                {
                    Id = mantenimiento.Id,
                    IdTipoProducto= mantenimiento.IdTipoProducto,
                    Nombre = mantenimiento.Nombre,
                    Descripcion= mantenimiento.Descripcion,
                    Checklist = tareas

                };
                mantenimientosOutDTO.Add(mantenimientoOutDTO);
            }

            return mantenimientosOutDTO;
        }

        public async Task<MantenimientoOutDTO> ActualizarMantenimientoAsync(MantenimientoActualizarDTO mantenimientoActualizarDTO, int id)
        {
            var mantenimiento = await _context.TipoMantenimiento.FindAsync(id);

            if (mantenimiento == null)
            {
                // Handle the case when the maintenance record is not found
                return null;
            }

            // Update the properties of the maintenance record
            mantenimiento.Nombre = mantenimientoActualizarDTO.Nombre;
            mantenimiento.Descripcion = mantenimientoActualizarDTO.Descripcion;

            // Remove existing checklist items
            var existingChecklistItems = await _context.CheckListMantenimiento
                .Where(c => c.IdTipoMantenimiento == mantenimiento.Id)
                .ToListAsync();
            _context.CheckListMantenimiento.RemoveRange(existingChecklistItems);

            // Add updated checklist items
            foreach (var item in mantenimientoActualizarDTO.Checklist)
            {
                var checkListMantenimientoDTO = new CheckListMantenimientoDTO
                {
                    IdTipoMantenimiento = mantenimiento.Id,
                    Tarea = item.Descripcion,
                    Obligatorio = item.Obligatorio
                };
                var checkListMantenimiento = _mapper.Map<CheckListMantenimiento>(checkListMantenimientoDTO);
                _context.CheckListMantenimiento.Add(checkListMantenimiento);
            }

            await _context.SaveChangesAsync();

            var mantenimientoOutDTO = _mapper.Map<MantenimientoOutDTO>(mantenimiento);
            return mantenimientoOutDTO;
        }

        public async Task<bool> EliminarMantenimientoAsync(int id)
        {
            var mantenimiento = await _context.TipoMantenimiento.FindAsync(id);

            if (mantenimiento == null)
            {
                return false; // Return false if the maintenance record is not found
            }

            var checklistItems = await _context.CheckListMantenimiento
                .Where(c => c.IdTipoMantenimiento == mantenimiento.Id)
                .ToListAsync();

            _context.CheckListMantenimiento.RemoveRange(checklistItems);
            _context.TipoMantenimiento.Remove(mantenimiento);

            await _context.SaveChangesAsync();

            return true; // Return true if the maintenance record is successfully deleted
        }

    }
}
