import { Router } from 'express';
import * as tabsController from '../controllers/tabs.js';
import { authorizeUser } from '../../auth/middleware/authorization.js';
const router: Router = Router();
router.use(authorizeUser);

router.post('/tabs', tabsController.handleAddTab);
router.get('/tabs', tabsController.handleGetTabs);
router.post('/tabs/remove', tabsController.handleDeleteTab);
export default router;
