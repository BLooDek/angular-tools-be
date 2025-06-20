import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  Request,
  RequestHandler,
  Router,
} from 'express';
import bcrypt from 'bcrypt';

import { defaultErrorHandler } from '../../shared/utils/errorHandler.js';
import {
  authorizeUser,
  validateUserLogin,
  valideUserCreate,
} from '../middleware/authorization.js';
import {
  handleUserCreation,
  handleUserLogin,
  handleUserLogout,
} from '../controllers/auth.js';
import { IS_DEV, JWT_SECRET } from '../../config/app.js';

const prisma = new PrismaClient();
const router: Router = Router();

interface User {
  id: string;
  email: string;
  name: string;
}

export interface RequestWithUser extends Request {
  user: User;
}

router.post('/register', valideUserCreate, handleUserCreation);

router.post('/login', valideUserCreate, validateUserLogin, handleUserLogin);

router.get(
  '/check-token',
  authorizeUser,
  async (req: ExpressRequest, res: ExpressResponse) => {
    const requestWithUser = req as RequestWithUser;
    const { email, name } = requestWithUser.user;
    res.status(200).json({ email, name });
  },
);

router.post('/logout', handleUserLogout);

export default router;
