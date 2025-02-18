import { z } from 'zod';

export const UpdateProvinciaSchema = z.object({
  nombre: z.string()
});

export const postProvinciaValidation = (provincia: any) => {
  return UpdateProvinciaSchema.safeParse(provincia);
};