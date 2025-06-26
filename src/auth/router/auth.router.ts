import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  Request,
  Router,
} from 'express';

import {
  authorizeUser,
  validateUserExists,
  validateUserLogin,
  valideUserCreate,
} from '../middleware/authorization.middleware.js';
import { User } from '../models/auth.interface.js';
import {
  handleUserCreation,
  handleUserLogin,
  handleUserLogout,
} from '../controllers/auth.controller.js';
const router: Router = Router();

export interface RequestWithUser extends Request {
  user: User;
}

router.post(
  '/register',
  valideUserCreate,
  validateUserExists,
  handleUserCreation,
);
router.post('/login', valideUserCreate, validateUserLogin, handleUserLogin);
router.get(
  '/check-token',
  authorizeUser,
  async (req: ExpressRequest, res: ExpressResponse) => {
    const requestWithUser = req as RequestWithUser;
    const { email, name } = requestWithUser.user;
    res.status(200).json({ email, name });
  },
);
router.post('/logout', handleUserLogout);

export default router;
