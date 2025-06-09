import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  Router,
  Request,
  RequestHandler,
} from 'express';
import { PrismaClient } from '@prisma/client';
import {
  authorizeUser,
  validateUserLogin,
  valideUserCreate,
} from '../middleware/authorization.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { defaultErrorHandler } from '../../shared/utils/errorHandler.js';
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

const handleUserCreation: RequestHandler = async (
  req: ExpressRequest,
  res: ExpressResponse,
) => {
  try {
    const { email, name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.cookie('token', token, {
      httpOnly: true, // TODO MOVE TO CONSTANTS
      sameSite: IS_DEV ? 'lax' : 'none',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
    });

    res.status(201).json({ name, email });
  } catch (error: { message: string } | any) {
    defaultErrorHandler(error, res, 'Error creating user', 500);
  }
};

const handleUserLogin: RequestHandler = async (
  req: ExpressRequest,
  res: ExpressResponse,
) => {
  /* #swagger.tags = ['Auth']
      #swagger.description = 'Logs in a user and returns a JWT token.'
      #swagger.requestBody = {
          required: true,
          content: {
              "application/json": {
                  schema: { $ref: "#/components/schemas/Login" }
              }
          }
      }
  */
  try {
    const { user } = req.body;

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: IS_DEV ? 'lax' : 'none',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
    });

    const { name, email } = user;
    res.status(200).json({ name, email });
  } catch (error: { message: string } | any) {
    defaultErrorHandler(error, res, 'Login failed', 500);
  }
};

const handleUserLogout: RequestHandler = (
  req: ExpressRequest,
  res: ExpressResponse,
) => {
  try {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error: { message: string } | any) {
    defaultErrorHandler(error, res, 'Logout failed', 500);
  }
};

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
