import { z } from 'zod';
import { PostDomicilioSchema } from '../domicilio/postDomicilio.validation';

export const PostEnvioSchema = z.object({
  descripcion: z.string(),
  hora: z.string().regex(/^\d{2}:\d{2}$/, 'Hora en formato HH:mm'),
  pesoGramos: z.number().int().positive(),
  reserva: z.boolean(),
  origen: PostDomicilioSchema,
  destino: PostDomicilioSchema,
  cliente: z.string()
});

export const postEnvioValidation = (envio: any) => {
  return PostEnvioSchema.safeParse(envio);
};
