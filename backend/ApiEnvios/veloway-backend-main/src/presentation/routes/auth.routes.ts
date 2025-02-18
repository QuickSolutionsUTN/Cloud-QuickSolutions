import { Router } from 'express';
import { authController } from '../../infrastructure/dependencies/container.dependency';
import { authenticateUser } from '../middlewares/auth.middleware';

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    router.post('/login', authController.login);
    router.post('/logout', authController.logout);
    router.get('/loginVerification', authenticateUser, authController.loginVerification);
    router.get('/refreshAccessToken', authController.refreshAccessToken);
    router.post('/password-reset/request', authController.requestPasswordReset);
    router.post('/password-reset/reset', authController.resetPassword);

    return router;
  }
};