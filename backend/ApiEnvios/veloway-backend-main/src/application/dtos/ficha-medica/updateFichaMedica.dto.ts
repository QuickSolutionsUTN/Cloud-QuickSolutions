import { updateFichaMedicaSchema } from "../../validations/ficha-medica/updateFichaMedica.validation";

export class UpdateFichaMedica{
    private constructor(
        public altura: number,
        public peso: number,
        public enfermedadCardiaca: string | null,
        public enfermedadRespiratoria: string | null,
        public alergias: string | null,
        public epilepsia: boolean,
        public diabetes: boolean,
        public compartir: boolean
    ){}

    public static create(fichaMedica: any): [string?, UpdateFichaMedica?] {
        const fichaMedicaValidation = updateFichaMedicaSchema.safeParse(fichaMedica);

        if (!fichaMedicaValidation.success) {
            return [JSON.parse(fichaMedicaValidation.error.message)];
        }

        return [undefined, new UpdateFichaMedica(
            fichaMedicaValidation.data.altura,
            fichaMedicaValidation.data.peso,
            fichaMedicaValidation.data.enfermedadCardiaca ?? null,
            fichaMedicaValidation.data.enfermedadRespiratoria ?? null,
            fichaMedicaValidation.data.alergias ?? null,
            fichaMedicaValidation.data.epilepsia,
            fichaMedicaValidation.data.diabetes,
            fichaMedicaValidation.data.compartir
        )];
    }
}