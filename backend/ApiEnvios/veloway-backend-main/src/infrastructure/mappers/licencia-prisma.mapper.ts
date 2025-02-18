import { Licencia } from "../../domain/entities/licencia.entity";
import { licencias as licenciasPrisma } from "@prisma/client";

export class LicenciaPrismaMapper {
    public static fromPrismaToEntity(licencia: licenciasPrisma): Licencia{
        const{
            numero,
            categoria,
            fechavencimiento,
            id_conductor
        } = licencia;

        return new Licencia(
            categoria,
            fechavencimiento,
            numero,
            id_conductor
        );
    } 

    public static fromPrismaArrayToEntity(licencias: licenciasPrisma[]): Licencia[] {
        return licencias.map((licencia)=> this.fromPrismaToEntity(licencia));
    }
}