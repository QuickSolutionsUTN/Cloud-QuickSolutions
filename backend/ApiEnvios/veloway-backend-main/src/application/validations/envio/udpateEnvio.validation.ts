import { z } from 'zod';
import { UpdateDomicilioSchema } from '../domicilio/updateEnvio.validation';


export const UpdateEnvioSchema = z.object({
  descripcion: z.string(),
  hora: z.string().regex(/^\d{2}:\d{2}$/, 'Hora en formato HH:mm'),
  pesoGramos: z.number().int().positive(),
  reserva: z.boolean(),
  origen: UpdateDomicilioSchema,
  destino: UpdateDomicilioSchema
});

export const updateEnvioValidation = (envio: any) => {
  return UpdateEnvioSchema.safeParse(envio);
};