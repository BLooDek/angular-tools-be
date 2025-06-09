import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  Router,
  Request,
  RequestHandler,
} from 'express';
import { PrismaClient } from '@prisma/client';
import { RequestWithUser } from '../../auth/router/auth.js';
import { authorizeUser } from '../../auth/middleware/authorization.js';
import { defaultErrorHandler } from '../../shared/utils/errorHandler.js';

const prisma = new PrismaClient();

interface Tab {
  id: string;
  title: string;
  type: string; // TODO: Define a more specific type if needed
  userId: string;
}

export const handleAddTab: RequestHandler = async (
  req: ExpressRequest,
  res: ExpressResponse,
) => {
  try {
    const { title, type } = req.body;
    const requestWithUser = req as RequestWithUser;
    const { id: userId } = requestWithUser.user;
    const newTab: Tab = await prisma.tabs.create({
      data: { title, type, userId },
    });

    res.status(201).json(newTab);
  } catch (error: { message: string } | any) {
    defaultErrorHandler(error, res, 'Error creating user', 500);
  }
};

export const handleGetTabs: RequestHandler = async (
  req: ExpressRequest,
  res: ExpressResponse,
) => {
  try {
    const requestWithUser = req as RequestWithUser;
    const { id: userId } = requestWithUser.user;
    const tabs: Tab[] = await prisma.tabs.findMany({
      where: { userId },
    });

    res
      .status(200)
      .json(tabs.map(({ id, title, type }) => ({ id, title, type })));
  } catch (error: { message: string } | any) {
    defaultErrorHandler(error, res, 'Error fetching tabs', 500);
  }
};

export const handleDeleteTab: RequestHandler = async (
  req: ExpressRequest,
  res: ExpressResponse,
) => {
  try {
    const { id } = req.body;
    const requestWithUser = req as RequestWithUser;
    const { id: userId } = requestWithUser.user;
    const deletedTab = await prisma.tabs.deleteMany({
      where: { id, userId },
    });

    if (deletedTab.count === 0) {
      res.status(404).json({ error: 'Tab not found' });
      return;
    }
    res.status(200).json({ message: 'Tab deleted successfully' });
  } catch (error: { message: string } | any) {
    defaultErrorHandler(error, res, 'Error deleting tab', 500);
  }
};
