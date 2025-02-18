import { z } from 'zod';

export const PostLicenciaSchema = z.object({
  categoria: z.string(),
  fechavencimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha en formato YYYY-MM-DD'),
  numero: z.number().int().refine((val) => val.toString().length >= 8 && val.toString().length <= 10, {
    message: 'El numero de licencia debe tener entre 8 y 10 dígitos'
  }),
  id_conductor: z.string()
});

export const postLicenciaValidation = (licencia: any) => {
  return PostLicenciaSchema.safeParse(licencia);
};