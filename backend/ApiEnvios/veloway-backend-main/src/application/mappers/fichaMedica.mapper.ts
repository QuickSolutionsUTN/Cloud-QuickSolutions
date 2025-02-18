import { FichaMedica } from "../../domain/entities/fichaMedica.entity";
import { PostFichaMedicaDto } from "../dtos/ficha-medica/postFichaMedica.dto";
import { UpdateFichaMedica } from "../dtos/ficha-medica/updateFichaMedica.dto";

export class FichaMedicaMapper{
    public static fromPostDtoToEntity(postFichaMedicaDto: PostFichaMedicaDto): FichaMedica {

        const { altura, peso, enfermedadCardiaca, enfermedadRespiratoria, alergias, epilepsia, diabetes, compartir, idConductor } = postFichaMedicaDto;

        return new FichaMedica(
            altura, 
            peso, 
            enfermedadCardiaca,
            enfermedadRespiratoria,
            alergias,
            epilepsia,
            diabetes,
            compartir,
            idConductor
        )
    }

    public static fromUpdateDtoToEntity(updateFichaMedicaDto: UpdateFichaMedica, fichaMedica: FichaMedica): FichaMedica {
        const { altura, peso, enfermedadCardiaca, enfermedadRespiratoria, alergias, epilepsia, diabetes, compartir } = updateFichaMedicaDto;

        return new FichaMedica(
            altura || fichaMedica.getAltura(), 
            peso || fichaMedica.getPeso(), 
            enfermedadCardiaca ?? fichaMedica.getEnfermedadCardiaca(),
            enfermedadRespiratoria ?? fichaMedica.getEnfermedadRespiratoria(),
            alergias ?? fichaMedica.getAlergias(),
            epilepsia || fichaMedica.getEpilepsia(),
            diabetes || fichaMedica.getDiabetes(),
            compartir || fichaMedica.getCompartir(),
            fichaMedica.getIdConductor()
        );
    }
}