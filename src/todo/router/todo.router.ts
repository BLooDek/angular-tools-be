import { PrismaClient } from '@prisma/client';
import { Request, Response, Router } from 'express';

import {
  handleAddTodo,
  handleGetTodos,
} from '../controllers/todo.controller.js';
import { Todo } from '../models/todo.interface.js';
import { RequestWithUser } from '../../auth/router/auth.js';
const router: Router = Router();
const prisma = new PrismaClient();

router.get('/todo/:id', handleGetTodos);
router.post('/todo', handleAddTodo);

router.put('/todo', (req: Request, res: Response) => {
  const { id, title, content } = req.body;
  // Here you would typically update the note in a database
  res
    .status(200)
    .json({ message: `Note with ID ${id} updated`, note: { title, content } });
});

export default router;
