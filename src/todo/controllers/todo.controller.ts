import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

import { defaultErrorHandler } from '../../shared/utils/errorHandler.js';
import { Todo } from '../models/todo.interface.js';
import { RequestWithUser } from '../../auth/routers/auth.router.js';
const prisma = new PrismaClient();

export const getTodos = async (req: Request, res: Response) => {
  try {
    const tabId = req.params.id;
    if (!tabId) {
      res.status(400).json({ error: 'Tab ID is required' });
      return;
    }
    const requestWithUser = req as RequestWithUser;
    const { id: userId } = requestWithUser.user;

    const todos: Todo[] = await prisma.todo.findMany({
      where: { userId, active: true, tabId },
    });
    res.status(200).json(
      todos.map(
        ({ id, title, content, tabId, completed, notify, notifyAt }) => ({
          id,
          title,
          content,
          completed,
          notify,
          notifyAt,
        }),
      ),
    );
  } catch (error: { message: string } | any) {
    defaultErrorHandler(error, res, 'Login failed', 500);
  }
};

export const addTodo = async (req: Request, res: Response) => {
  try {
    const { title, content, tabId, completed, notify, notifyAt } =
      req.body ?? {};
    const requestWithUser = req as RequestWithUser;
    const { id: userId } = requestWithUser.user;

    const newTodo: Todo = await prisma.todo.create({
      data: { title, content, userId, tabId, completed, notify, notifyAt },
    });

    res.status(201).json(newTodo);
  } catch (error: { message: string } | any) {
    defaultErrorHandler(error, res, 'Login failed', 500);
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { id, tabId, active, title, content, completed, notify, notifyAt } =
      req.body ?? {};
    if (!id || !tabId) {
      res.status(400).json({ error: 'Todo/Tab ID is required' });
      return;
    }
    const requestWithUser = req as RequestWithUser;
    const { id: userId } = requestWithUser.user;

    const updatedTodo: Todo = await prisma.todo.update({
      where: { id, userId, tabId },
      data: { title, content, completed, notify, notifyAt, active },
    });

    res.status(200).json(updatedTodo);
  } catch (error: { message: string } | any) {
    defaultErrorHandler(error, res, 'Login failed', 500);
  }
};
