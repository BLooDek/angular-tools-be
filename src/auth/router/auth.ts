import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  Router,
} from 'express';
import { PrismaClient } from '@prisma/client';
import {
  validateUserLogin,
  valideUserCreate,
} from '../middleware/authorization.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { defaultErrorHandler } from '../../shared/utils/errorHandler.js';
import { JWT_SECRET } from '../../config/app.js';

const prisma = new PrismaClient();
const router: Router = Router();

import { RequestHandler } from 'express';

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
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 3600000, // 1 hour
    });

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error: { message: string } | any) {
    defaultErrorHandler(error, res, 'Error creating user', 500);
  }
};

const handleUserLogin: RequestHandler = async (
  req: ExpressRequest,
  res: ExpressResponse,
) => {
  try {
    const { user } = req.body;

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
    });

    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error: { message: string } | any) {
    defaultErrorHandler(error, res, 'Login failed', 500);
  }
};

router.post('/users', valideUserCreate, handleUserCreation);
router.post('/login', valideUserCreate, validateUserLogin, handleUserLogin);

export default router;
