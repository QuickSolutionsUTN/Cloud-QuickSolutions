export class CustomError extends Error {
  private constructor (
    public readonly statusCode: number,
    public readonly message: string
  ) {
    super(message);
  }

  static badRequest (message: string): CustomError {
    return new CustomError(400, message);
  }

  static notFound (message: string): CustomError {
    return new CustomError(404, message);
  }

  static unauthorized (message: string): CustomError { // No tiene permisos de autenticación
    return new CustomError(401, message);
  }

  static forbidden (message: string): CustomError { // No tiene permisos de acceso a un recurso (autorización)
    return new CustomError(403, message);
  }

  static internalServerError (message: string = 'Internal Server Error'): CustomError {
    return new CustomError(500, message);
  }
}