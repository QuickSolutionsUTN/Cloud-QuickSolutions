

export interface IBcryptHashProvider {
 hash: (contraseña: string) => Promise<string>
 compare: (contraseña: string, hashedPassword: string) => Promise<boolean>
 }
