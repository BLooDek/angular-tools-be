import { Router } from 'express';
import * as tabsController from '../controllers/tabs.controller.js';
const router: Router = Router();

router.post('/tabs', tabsController.handleAddTab);
router.get('/tabs', tabsController.handleGetTabs);
router.post('/tabs/remove', tabsController.handleDeleteTab);
export default router;
