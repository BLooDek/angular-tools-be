import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { valideUserCreate } from '../middleware/authentication.js';
const prisma = new PrismaClient();
const router = Router();

router.post('/users', valideUserCreate, async (req, res) => {
  try {
    const { email, name } = req.body;
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
      },
    });
    res.status(201).json(newUser);
  } catch (error: { message: string } | any) {
    res.status(500).json({
      error: 'Could not create user',
      details: process.env.ENV === 'development' ? error.message : null,
    });
  }
});
export default router;
