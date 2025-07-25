import { IS_DEV } from '../../config/app.config.js';
import { Response } from 'express';

export const defaultErrorHandler = (
  error: any,
  res: Response,
  message: string,
  code: number,
) =>
  res.status(code).json({
    error: message,
    details: IS_DEV && error?.message ? error?.message : null,
  });
