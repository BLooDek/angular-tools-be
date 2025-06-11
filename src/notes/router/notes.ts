import { Router } from 'express';
import { authorizeUser } from '../../auth/middleware/authorization.js';
import {
  handleAddNote,
  handleDeleteNote,
  handleGetNotes,
  handleUpdateNote,
} from '../../notes/controllers/notes.js';
const router: Router = Router();
router.use(authorizeUser);

router.post('/notes', handleAddNote);
router.post('/notes/get', handleGetNotes);
router.patch('/notes', handleUpdateNote); // Assuming this is for updating notes
router.post('/notes/remove', handleDeleteNote);

export default router;
