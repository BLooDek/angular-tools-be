import { Router } from 'express';
import * as tabsController from '../controllers/tabs.controller.js';
import { validateTabType } from '../middleware/tabs.middleware.js';
const router: Router = Router();

router.post('/tabs', validateTabType, tabsController.addTab);
router.get('/tabs', tabsController.getTabs);
router.post('/tabs/remove', tabsController.deleteTab);
export default router;
