import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  RequestHandler,
} from 'express';
import bcrypt from 'bcrypt';

import { defaultErrorHandler } from '../../shared/utils/errorHandler.js';
import { IS_DEV, JWT_SECRET } from '../../config/app.js';

const prisma = new PrismaClient();
export const handleUserLogout: RequestHandler = (
  req: ExpressRequest,
  res: ExpressResponse,
) => {
  try {
    /* #swagger.requestBody = {
            required: false,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                        },
                    }  
                }
            }
        } 
    */
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error: { message: string } | any) {
    defaultErrorHandler(error, res, 'Logout failed', 500);
  }
};
export const handleUserCreation: RequestHandler = async (
  req: ExpressRequest,
  res: ExpressResponse,
) => {
  try {
    /* #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            password: { type: "string" },
                            email: { type: "string" },
                            name: { type: "string" },
                        },
                        required: ["password", "email"]
                    }  
                }
            }
        } 
    */
    const { email, name, password } = req.body ?? {};
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

    res.status(201).json({ name, email, token });
  } catch (error: { message: string } | any) {
    defaultErrorHandler(error, res, 'Error creating user', 500);
  }
};

export const handleUserLogin: RequestHandler = async (
  req: ExpressRequest,
  res: ExpressResponse,
) => {
  try {
    /* #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            password: { type: "string" },
                            email: { type: "string" },
                        },
                        required: ["password", "email"]
                    }  
                }
            }
        } 
    */

    const { user } = req.body ?? {};

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
    res.status(200).json({ name, email, token });
  } catch (error: { message: string } | any) {
    defaultErrorHandler(error, res, 'Login failed', 500);
  }
};
