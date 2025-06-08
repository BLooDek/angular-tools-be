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
const router: Router = Router();
router.use(authorizeUser);
interface Tab {
  id: string;
  title: string;
  type: string; // TODO: Define a more specific type if needed
  userId: string;
}

/**
 * @swagger
 * /api/tabs:
 *   post:
 *     summary: Add a new tab
 *     tags: [Tabs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the tab
 *               type:
 *                 type: string
 *                 description: The type of the tab (e.g., 'document', 'spreadsheet')
 *             example:
 *               title: "My New Document"
 *               type: "document"
 *     responses:
 *       201:
 *         description: The tab was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/tab'
 *       500:
 *         description: Some server error
 */
const handleAddTab: RequestHandler = async (
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

/**
 * @swagger
 * /api/tabs:
 *   get:
 *     summary: Get all tabs for the authenticated user
 *     tags: [Tabs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of tabs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '/components/schemas/Tab'
 *       500:
 *         description: Some server error
 */
const handleGetTabs: RequestHandler = async (
  req: ExpressRequest,
  res: ExpressResponse,
) => {
  try {
    const requestWithUser = req as RequestWithUser;
    const { id: userId } = requestWithUser.user;
    const tabs: Tab[] = await prisma.tabs.findMany({
      where: { userId },
    });
    res.status(200).json(tabs);
  } catch (error: { message: string } | any) {
    defaultErrorHandler(error, res, 'Error fetching tabs', 500);
  }
};

/**
 * @swagger
 * /api/tabs/remove:
 *   post:
 *     summary: Delete a tab by ID
 *     tags: [Tabs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the tab to delete
 *             example:
 *               id: "clx0z0z0z0000000000000000"
 *     responses:
 *       200:
 *         description: Tab deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tab deleted successfully"
 *       404:
 *         description: Tab not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Tab not found"
 *       500:
 *         description: Some server error
 */
const handleDeleteTab: RequestHandler = async (
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

router.post('/tabs', handleAddTab);
router.get('/tabs', handleGetTabs);
router.post('/tabs/remove', handleDeleteTab);
export default router;
