import { PostCheckpointValidation } from '../../validations/checkpoint/postCheckpoint.validation';

export class PostCheckpointDto {
  private constructor(
    public numero: number,
    public idViaje: number,
    public latitud: number,
    public longitud: number
  ) {}

  public static create(checkpoint: any): [string?, PostCheckpointDto?] {
    const checkpointValidation = PostCheckpointValidation(checkpoint);

    if (!checkpointValidation.success) {
      return [JSON.stringify(checkpointValidation.error.errors), undefined];
    }

    const data = checkpointValidation.data;

    return [
      undefined,
      new PostCheckpointDto(
        data.numero,
        data.idViaje,
        data.latitud,
        data.longitud
      )
    ];
  }
}
