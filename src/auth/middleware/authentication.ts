import { RequestHandler } from 'express';

export const valideUserCreate: RequestHandler = (req, res, next) => {
  const { email, name } = req.body;

  if (!email || !name) {
    res.status(400).json({
      error: 'Email and name are required',
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
