import { z } from 'zod';
import { PostProvinciaSchema } from '../provincia/postProvincia.validation';

export const GetLocalidadSchema = z.object({
  codigoPostal: z.number().int(),
  nombre: z.string(),
  provincia: PostProvinciaSchema
});

export const postLocalidadValidation = (localidad: any) => {
  return GetLocalidadSchema.safeParse(localidad);
};