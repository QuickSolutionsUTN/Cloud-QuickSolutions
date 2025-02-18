import { z } from 'zod';

export const updateFichaMedicaSchema = z.object({
    altura: z.number().int(),
    peso: z.number(),
    enfermedadCardiaca: z.string().nullable(),
    enfermedadRespiratoria: z.string().nullable(),
    alergias: z.string().nullable(),
    epilepsia: z.boolean(),
    diabetes: z.boolean(),
    compartir: z.boolean(),
})

export const updateFichaMedicaValidation = (fichaMedica: any) => {  
    return updateFichaMedicaSchema.safeParse(fichaMedica);
}