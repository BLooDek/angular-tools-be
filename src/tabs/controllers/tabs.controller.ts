import { PrismaClient } from '@prisma/client';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  Request,
  RequestHandler,
  Router,
} from 'express';

import { defaultErrorHandler } from '../../shared/utils/errorHandler.js';
import { RequestWithUser } from '../../auth/router/auth.router.js';

const prisma = new PrismaClient();

interface Tab {
  id: string;
  title: string;
  type: string; // TODO: Define a more specific type if needed
  userId: string;
}

export const addTab: RequestHandler = async (
  req: ExpressRequest,
  res: ExpressResponse,
) => {
  try {
    const { title, type } = req.body ?? {};
    const requestWithUser = req as RequestWithUser;
    const { id: userId } = requestWithUser.user;
    const newTab: Tab = await prisma.tabs.create({
      data: { title, type, userId },
    });

    res.status(201).json(newTab);
  } catch (error: { message: string } | any) {
    defaultErrorHandler(error, res, 'Error creating tab', 500);
  }
};

export const getTabs: RequestHandler = async (
  req: ExpressRequest,
  res: ExpressResponse,
) => {
  try {
    const requestWithUser = req as RequestWithUser;
    const { id: userId } = requestWithUser.user;
    const tabs: Tab[] = await prisma.tabs.findMany({
      where: { userId, active: true },
    });

    res
      .status(200)
      .json(tabs.map(({ id, title, type }) => ({ id, title, type })));
  } catch (error: { message: string } | any) {
    defaultErrorHandler(error, res, 'Error fetching tabs', 500);
  }
};

export const deleteTab: RequestHandler = async (
  req: ExpressRequest,
  res: ExpressResponse,
) => {
  try {
    const { id } = req.body ?? {};
    const requestWithUser = req as RequestWithUser;
    const { id: userId } = requestWithUser.user;
    const deletedTab = await prisma.tabs.updateMany({
      where: { id, userId },
      data: { active: false },
    });

    if (deletedTab.count === 0) {
      res.status(404).json({ error: 'Tab not found' });
      return;
    }

    await prisma.notes.updateMany({
      where: { tabId: id, userId },
      data: { active: false },
    });
    res.status(200).json({ message: 'Tab deleted successfully' });
  } catch (error: { message: string } | any) {
    defaultErrorHandler(error, res, 'Error deleting tab', 500);
  }
};
