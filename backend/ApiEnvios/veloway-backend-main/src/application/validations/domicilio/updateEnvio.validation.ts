import { z } from 'zod';

export const UpdateDomicilioSchema = z.object({
  calle: z.string(),
  numero: z.number().int(),
  piso: z.number().int().nullable(),
  depto: z.string().nullable(),
  descripcion: z.string().nullable(),
  localidadID: z.number().int()
});

export const postDomicilioValidation = (domicilio: any) => {
  return UpdateDomicilioSchema.safeParse(domicilio);
};