import { Router } from 'express';
import {
  handleAddNote,
  handleDeleteNote,
  handleGetNotes,
  handleUpdateNote,
} from '../../notes/controllers/notes.js';
const router: Router = Router();

router.post('/notes', handleAddNote);
router.post('/notes/get', handleGetNotes);
router.put('/notes', handleUpdateNote);
router.post('/notes/remove', handleDeleteNote);

export default router;
