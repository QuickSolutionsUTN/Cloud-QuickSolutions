import { z } from "zod";

export const UpdateLicenciaSchema = z.object({
    categoria: z.string(),
    fechavencimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha en formato YYYY-MM-DD'),
    numero: z.number(),
})

export const updateLicenciaValidation = (licencia: any) => {
    return UpdateLicenciaSchema.safeParse(licencia);
}
