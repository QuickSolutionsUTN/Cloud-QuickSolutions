import { z } from 'zod';

const postVehiculoSchema = z.object({
  anio: z.number().int().positive().min(1900),
  color: z.string().max(50),
  descripcion: z.string().max(255).nullable(),
  patente: z.string().min(5).max(7).trim(),
  tipoVehiculoId: z.number(),
  modeloId: z.number(),
  marcaId: z.number(),
  id_conductor: z.string()
});

export const postVehiculoValidation = (data: any) => {
  return postVehiculoSchema.safeParse(data);
};