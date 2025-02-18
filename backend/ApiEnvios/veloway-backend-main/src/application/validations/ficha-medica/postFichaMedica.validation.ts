import { z } from 'zod';

export const PostFichaMedicaSchema = z.object({
    altura: z.number().int(),
    peso: z.number(),
    enfermedadCardiaca: z.string().nullable(),
    enfermedadRespiratoria: z.string().nullable(),
    alergias: z.string().nullable(),
    epilepsia: z.boolean(),
    diabetes: z.boolean(),
    compartir: z.boolean(),
    id_conductor: z.string()
})

export const postFichaMedicaValidation = (fichaMedica: any) => {
    return PostFichaMedicaSchema.safeParse(fichaMedica);
}