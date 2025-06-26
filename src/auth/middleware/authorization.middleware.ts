import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
  RequestHandler,
} from 'express';
import bcrypt from 'bcrypt';

import { defaultErrorHandler } from '../../shared/utils/errorHandler.js';
import { COOKIE_AUTH, JWT_SECRET } from '../../config/app.config.js';
import { emailRegex } from '../const/auth.const.js';

const prisma = new PrismaClient();

export const valideUserCreate: RequestHandler = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    res.status(400).json({
      error: 'Email and password is required.',
    });
    return;
  }

  if (!emailRegex.test(email)) {
    res.status(400).json({
      error: ` Doesnt match ${emailRegex} `,
    });
    return;
  }

  next();
};

export const validateUserExists: RequestHandler = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  const { email } = req.body ?? {};
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    defaultErrorHandler(
      { message: 'Email already exists' },
      res,
      'User already exists',
      409,
    );
    return;
  }
  next();
};

export const validateUserLogin: RequestHandler = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  const { email, password } = req.body ?? {};

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

export const authorizeUser: RequestHandler = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  try {
    const token = COOKIE_AUTH
      ? req?.cookies?.token
      : req.headers.authorization?.split(' ')[1];

    if (!token) {
      defaultErrorHandler(null, res, 'No token provided', 401);
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      defaultErrorHandler(null, res, 'Unauthorized', 401);
      return;
    }

    (req as any).user = user;
    next();
  } catch (error: { message: string } | any) {
    console.log(error);
    if (error.name === 'TokenExpiredError') {
      defaultErrorHandler(error, res, 'Token expired', 401);
      return;
    }
    if (error.name === 'JsonWebTokenError') {
      defaultErrorHandler(error, res, 'Invalid token', 401);
      return;
    }
    defaultErrorHandler(error, res, 'Authorization failed', 500);
  }
};
