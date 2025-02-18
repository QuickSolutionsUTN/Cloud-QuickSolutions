import { z } from 'zod';

export const PostProvinciaSchema = z.object({
  nombre: z.string()
});

export const postProvinciaValidation = (provincia: any) => {
  return PostProvinciaSchema.safeParse(provincia);
};