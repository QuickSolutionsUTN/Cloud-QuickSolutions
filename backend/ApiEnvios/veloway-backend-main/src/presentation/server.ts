import express, { type Router } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { FRONTEND_URL } from '../config/envs.config';

const corsOptions = {
  origin: [FRONTEND_URL],
  credentials: true
};

export interface Options {
  port?: number
  routes: Router
}

export class Server {
  public readonly app = express();
  private readonly port: number;
  private readonly routes: Router;

  constructor(options: Options) {
    this.port = options.port || 3001;
    this.routes = options.routes;
  }

  async start(): Promise<void> {
    // Middlewares
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded
    this.app.use(cors(corsOptions));
    this.app.use(cookieParser());

    // Routes
    this.app.use(this.routes);

    // Start server
    this.app.listen(this.port, () => {
      console.log(`Server is running on http://localhost:${this.port}`);
    });
  }
}

