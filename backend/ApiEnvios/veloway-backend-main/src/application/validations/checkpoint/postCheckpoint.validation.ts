import { z } from 'zod';

export const PostCheckpointSchema = z.object({
  numero: z.number().int().positive(),
  idViaje: z.number(),
  latitud: z.number(),
  longitud: z.number()
});

export const PostCheckpointValidation = (checkpoint: any) => {
  return PostCheckpointSchema.safeParse(checkpoint);
};