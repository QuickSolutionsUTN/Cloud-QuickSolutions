import { type FichaMedica } from "../entities/fichaMedica.entity";

export interface IFichasMedicasRepository {
    getAll: () => Promise <FichaMedica[]>
    getFichaMedica: (fichaMedicaID: number) => Promise<FichaMedica | null> 
    getFichaMedicaByConductorId: (conductorID: string) => Promise<FichaMedica | null>
    create: (fichaMedica: FichaMedica) => Promise<FichaMedica>
    update: (idFichaMedica: number, fichaMedica: FichaMedica) => Promise<FichaMedica>
    delete: (idFichaMedica: number) => Promise<void>
}