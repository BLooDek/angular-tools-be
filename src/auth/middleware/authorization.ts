import {
  RequestHandler,
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from 'express';
import { PrismaClient } from '@prisma/client';
import { defaultErrorHandler } from '../../shared/utils/errorHandler.js';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

export const valideUserCreate: RequestHandler = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      error: 'Email and password is required.',
    });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({
      error: 'Invalid email format',
    });
    return;
  }

  next();
};

export const validateUserLogin: RequestHandler = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    defaultErrorHandler(
      { message: 'Email invalid' },
      res,
      'Invalid credentials',
      401,
    );
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    defaultErrorHandler(
      { message: 'Pasword invalid' },
      res,
      'Invalid credentials',
      401,
    );
    return;
  }

  (req as any).body.user = user;

  next();
};
