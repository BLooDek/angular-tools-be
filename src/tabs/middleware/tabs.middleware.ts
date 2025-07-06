import { NextFunction, Response, Request, RequestHandler } from 'express';
import { defaultErrorHandler } from '../../shared/utils/errorHandler.js';

export const validateTabType: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validTypes = new Set(['notes', 'todos']);
    const { type, title } = req.body ?? {};
    if (!validTypes.has(type)) {
      defaultErrorHandler(
        { message: 'Invalid tab type' },
        res,
        'Tab type must be one of: notes, todos',
        400,
      );
    }
    if (!title || typeof title !== 'string' || title.trim() === '') {
      defaultErrorHandler(
        { message: 'Invalid title' },
        res,
        'Title must be a non-empty string',
        400,
      );
    }

    next();
  } catch (error: { message: string } | any) {
    defaultErrorHandler(error, res, 'Error creating user', 500);
  }
};
