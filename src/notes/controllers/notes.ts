import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  Router,
  Request,
  RequestHandler,
} from 'express';
import { PrismaClient } from '@prisma/client';
import { RequestWithUser } from '../../auth/router/auth.js';
import { defaultErrorHandler } from '../../shared/utils/errorHandler.js';

const prisma = new PrismaClient();

interface Note {
  id: string;
  title: string;
  content: string;
  userId: string;
  tabId: string;
}
// TODO: add limit on numb of chars in title content <- also on ui
export const handleAddNote: RequestHandler = async (
  req: ExpressRequest,
  res: ExpressResponse,
) => {
  try {
    const { title, content, tabId } = req.body;
    const requestWithUser = req as RequestWithUser;
    const { id: userId } = requestWithUser.user;
    const newNote: Note = await prisma.notes.create({
      data: { title, content, userId, tabId },
    });

    res.status(201).json(newNote);
  } catch (error: { message: string } | any) {
    defaultErrorHandler(error, res, 'Error creating note', 500);
  }
};
export const handleGetNotes: RequestHandler = async (
  req: ExpressRequest,
  res: ExpressResponse,
) => {
  try {
    const { tabId } = req.body;
    const requestWithUser = req as RequestWithUser;
    const { id: userId } = requestWithUser.user;
    const notes: Note[] = await prisma.notes.findMany({
      where: { userId, active: true, tabId },
    });

    res.status(200).json(
      notes.map(({ id, title, content, tabId }) => ({
        id,
        title,
        content,
        tabId,
      })),
    );
  } catch (error: { message: string } | any) {
    defaultErrorHandler(error, res, 'Error fetching notes', 500);
  }
};
export const handleUpdateNote: RequestHandler = async (
  req: ExpressRequest,
  res: ExpressResponse,
) => {
  try {
    const { id, title, content, tabId } = req.body;
    const requestWithUser = req as RequestWithUser;
    const { id: userId } = requestWithUser.user;

    const updatedNote = await prisma.notes.update({
      where: { id, userId, tabId },
      data: { title, content },
    });

    res.status(200).json(updatedNote);
  } catch (error: { message: string } | any) {
    defaultErrorHandler(error, res, 'Error updating note', 500);
  }
};

export const handleDeleteNote: RequestHandler = async (
  req: ExpressRequest,
  res: ExpressResponse,
) => {
  try {
    const { id } = req.body;
    const requestWithUser = req as RequestWithUser;
    const { id: userId } = requestWithUser.user;
    await prisma.notes.update({
      where: { id, userId },
      data: { active: false },
    });

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error: { message: string } | any) {
    defaultErrorHandler(error, res, 'Error deleting note', 500);
  }
};
