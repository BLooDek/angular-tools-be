import { NextFunction, Request, Response } from 'express';

import { emptyField } from '../../shared/utils/utils.js';
export const validateAddTodo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { title, content, tabId } = req.body ?? {};
  const fieldsCheck = [title, content, tabId].some(emptyField);
  if (fieldsCheck) {
    res.status(400).json({
      error: 'Title, content and tabId are required.',
    });
    return;
  }

  next();
};
