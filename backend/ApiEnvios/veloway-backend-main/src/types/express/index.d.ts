import 'express';

declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: string
        nombre: string
        apellido: string
        email: string
        esConductor: boolean
        activo: boolean
      }
      apikey?: string
    }
  }
}