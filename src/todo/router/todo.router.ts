import { PrismaClient } from '@prisma/client';
import { Request, Response, Router } from 'express';

import {
  addTodo,
  getTodos,
  updateTodo,
} from '../controllers/todo.controller.js';
import { validateAddTodo } from '../middleware/todo.middleware.js';
const router: Router = Router();
const prisma = new PrismaClient();

router.get('/todo/:id', getTodos);
router.post('/todo', validateAddTodo, addTodo);
router.put('/todo', updateTodo);

export default router;
