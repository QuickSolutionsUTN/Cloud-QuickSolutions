import { type Response } from 'express';
import { CustomError } from '../../application/errors/custom.errors';

export class HandleError {
  static throw(error: unknown, res: Response): any {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

