import { updateLicenciaValidation } from "../../validations/licencia/updateLicencia.validation";

export class UpdateLicenciaDto {
    private constructor(
        public categoria: string,
        public fechaVenc: Date,
        public numero: number
    ){}

    public static create(updateLicencia: any): [string?, UpdateLicenciaDto?]  {
        const licenciaValidation = updateLicenciaValidation(updateLicencia);

        if (!licenciaValidation.success) {
            throw new Error(licenciaValidation.error.message);
        }

        const fechaVencDate = new Date(licenciaValidation.data.fechavencimiento);
        
        return [undefined, new UpdateLicenciaDto(
            licenciaValidation.data.categoria,
            fechaVencDate,
            licenciaValidation.data.numero
        )];
    }
}

